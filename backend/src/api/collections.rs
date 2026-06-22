use std::sync::Arc;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::Json;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool};
use crate::api::error::{bad_request_error, conflict_error, database_error, internal_server_error, not_found_error};
use crate::api::utils::generate_unique_slug;
use crate::AppState;

#[derive(Debug, Serialize, FromRow)]
pub struct Collection {
    pub id: i32,
    pub name: String,
    pub slug: String,
    pub description: Option<String>,
    pub cover_work_id: Option<i32>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct CollectionDisplay {
    pub id: i32,
    pub name: String,
    pub slug: String,
    pub description: Option<String>,
    pub cover_work_id: Option<i32>,
    pub cover_image: Option<String>,
}

#[derive(Deserialize)]
pub struct QueryCollection{
    pub name: Option<String>,
    pub description: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdateCover{
    pub work_id: i32
}

 async fn get_all_collections_handler(pool: &PgPool) -> Result<Vec<CollectionDisplay>,sqlx::Error> {
     sqlx::query_as!(
        CollectionDisplay,
        "SELECT c.id, c.name, c.slug, c.description, c.cover_work_id, w.image as cover_image
         FROM collections c
         LEFT JOIN works w ON w.id = c.cover_work_id"
    )
         .fetch_all(pool)
         .await
}

pub async fn get_all_collections(State(state): State<Arc<AppState>>) -> Result<Json<Vec<CollectionDisplay>>, (StatusCode, Json<serde_json::Value>)> {
    let mut collections = get_all_collections_handler(&state.db).await.map_err(|e| database_error(e))?;

    for collection in collections.iter_mut() {
        if let Some(image) = collection.cover_image.clone() {
            collection.cover_image = Some(state.storage.public_url(&image));
        }
    }
    Ok(Json(collections))
}

async fn get_collection_by_slug_handler(pool: &PgPool, slug: String) -> Result<CollectionDisplay, sqlx::Error> {
    sqlx::query_as::<_, CollectionDisplay>("SELECT c.id,c.name,c.slug,c.description, c.cover_work_id, w.image as cover_image FROM collections c LEFT JOIN works w ON w.id=c.cover_work_id WHERE c.slug = $1")
        .bind(slug)
        .fetch_one(pool)
    .await
}

pub async fn get_collection_by_slug(State(state): State<Arc<AppState>>, Path(slug): Path<String>) -> Result<Json<CollectionDisplay>, (StatusCode, Json<serde_json::Value>)> {
    let mut collection = get_collection_by_slug_handler(&state.db, slug).await.map_err(|e| database_error(e))?;

    if let Some(image) = collection.cover_image {
        collection.cover_image = Some(state.storage.public_url(&image));
    }


    Ok(Json(collection))
}

pub async fn create_collection(State(state): State<Arc<AppState>>, Json(body): Json<QueryCollection>)
    -> Result<(StatusCode, Json<Collection>),(StatusCode, Json<serde_json::Value>)>{

    let name = body.name.ok_or_else(|| bad_request_error("name is required"))?;

    let existing_collection = sqlx::query_as!(Collection, "SELECT * FROM collections WHERE name = $1", name)
        .fetch_optional(&state.db)
        .await
        .map_err(|e| database_error(e))?;

    if existing_collection.is_some(){
         return Err(conflict_error("Collection already exists"))
    }
        let slug = generate_unique_slug(&name, &state.db, "collections")
            .await
            .map_err(|e| database_error(e))?;

        sqlx::query_as!(Collection, "INSERT INTO collections (name, slug, description) VALUES ($1, $2, $3) RETURNING *", name, slug, body.description)
            .fetch_one(&state.db)
            .await
            .map(|c| (StatusCode::CREATED, Json(c)))
            .map_err(|_| internal_server_error("Failed to create Collection"))
}

pub async fn update_collection(State(state): State<Arc<AppState>>, Path(slug): Path<String>, Json(body): Json<QueryCollection>)
                               -> Result<(StatusCode, Json<Collection>), (StatusCode, Json<serde_json::Value>)>{
    let existing_collection = sqlx::query_as!(Collection, "SELECT * FROM collections WHERE slug = $1", slug)
        .fetch_optional(&state.db)
        .await
        .map_err(|e| database_error(e))?;


    if let Some(existing) = existing_collection{
        let new_name = body.name.as_deref();

        let new_description = body.description.or(existing.description);

        let new_slug = match new_name {
            Some(name) if name != existing.name => {
                generate_unique_slug(name, &state.db, "collections")
                    .await
                    .map_err(|e| database_error(e))?
            }
            _ => existing.slug.clone(),
        };

        let final_name = new_name.unwrap_or(&existing.name);


        sqlx::query_as!(Collection, "UPDATE collections SET name=$1, slug=$2, description=$3 WHERE slug=$4 RETURNING *", final_name, new_slug, new_description,slug)
            .fetch_one(&state.db)
            .await
            .map(|c| (StatusCode::OK, Json(c)))
            .map_err(|_| internal_server_error("Failed to update collection"))
    } else {
        Err(not_found_error("collection does not exist"))
    }
}

pub async fn delete_collection(State(state): State<Arc<AppState>>, Path(slug): Path<String>)
    -> Result<(StatusCode, Json<Collection>), (StatusCode, Json<serde_json::Value>)>{
    let existing_collection = sqlx::query_as!(Collection, "SELECT * FROM collections WHERE slug = $1", slug)
        .fetch_optional(&state.db)
        .await
        .map_err(|e| database_error(e))?;

    if existing_collection.is_some(){
        let collection_id = existing_collection.unwrap().id;

        let works_count = sqlx::query!("SELECT COUNT(*) as count FROM works WHERE collection_id = $1", collection_id)
            .fetch_one(&state.db)
            .await
            .map_err(|e| database_error(e))?;

        if works_count.count.unwrap() > 0 {
            return Err(conflict_error(&format!("Delete {} works attached to collection first",works_count.count.unwrap())));
        }

        sqlx::query_as!(Collection, "DELETE FROM collections WHERE id = $1 RETURNING *", collection_id)
            .fetch_one(&state.db)
            .await
            .map(|c| (StatusCode::OK, Json(c)))
            .map_err(|_| internal_server_error("Failed to delete collection"))
    }else {
        Err(not_found_error("collection does not exist"))

    }
}

pub async fn update_collection_cover(State(state): State<Arc<AppState>>, Path(slug): Path<String>, Json(body): Json<UpdateCover>)
-> Result<(StatusCode, Json<Collection>), (StatusCode, Json<serde_json::Value>)>{
    let existing_collection = sqlx::query_as!(Collection, "SELECT * FROM collections WHERE slug = $1", slug)
        .fetch_optional(&state.db)
        .await
        .map_err(|e| database_error(e))?;

    if existing_collection.is_some() {
        let collection_id = existing_collection.unwrap().id;
        let existing_work = sqlx::query!("SELECT id, collection_id FROM works WHERE id = $1", body.work_id)
            .fetch_optional(&state.db)
            .await
            .map_err(|e| database_error(e))?;

        if existing_work.is_none(){
            return Err(not_found_error("work does not exist"));
        }

        if existing_work.unwrap().collection_id != Some(collection_id){
            return Err(conflict_error("work does not belong to this collection"));
        }

        sqlx::query_as!(Collection, "UPDATE collections SET cover_work_id = $1 WHERE id = $2 RETURNING *", body.work_id, collection_id)
            .fetch_one(&state.db)
            .await
            .map(|c| (StatusCode::OK, Json(c)))
            .map_err(|_| internal_server_error("Failed to update collection cover"))
    } else {
        Err(not_found_error("collection does not exist"))
    }


}
