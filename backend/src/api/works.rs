use std::mem;
use std::sync::Arc;
use axum::extract::{Multipart, Path, State};
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool};
use axum::Json;
use chrono::Utc;
use crate::api::error::{bad_request_error, conflict_error, database_error, internal_server_error, not_found_error};
use crate::api::utils::generate_unique_slug;
use crate::AppState;

#[derive(Debug, Serialize, FromRow)]
pub struct Work {
    pub id: i32,
    pub title: String,
    pub slug: String,
    pub description: Option<String>,
    pub year: i16,
    pub image: String,
    pub art_type: String,
    pub collection_id: Option<i32>,
    pub medium_id: Option<i32>,
    pub created_at: chrono::DateTime<Utc>,
    pub updated_at: chrono::DateTime<Utc>,

}

#[derive(Debug, Serialize, FromRow)]
pub struct GetWork {
    pub id: i32,
    pub title: String,
    pub slug: String,
    pub description: Option<String>,
    pub year: i16,
    pub image: String,
    pub collection_medium_name: String,
    pub art_type: String,
}

#[derive(Deserialize)]
pub struct UpdateWork {
    pub title: Option<String>,
    pub description: Option<String>,
    pub year: Option<i16>,
}

async fn get_work_by_slug_handler(pool: &PgPool,slug: String) -> Result<GetWork,sqlx::Error> {
     sqlx::query_as::<_,GetWork>("SELECT works.id, works.title, works.slug, works.description, works.year, works.image, works.art_type,
    COALESCE(collections.name,mediums.name) AS collection_medium_name
    FROM works
    LEFT JOIN collections ON collections.id = works.collection_id
    LEFT JOIN mediums ON mediums.id = works.medium_id
    WHERE works.slug = $1")
    .bind(slug)
    .fetch_one(pool)
    .await
}

pub async fn get_work_by_slug(State(state): State<Arc<AppState>>, Path(slug): Path<String>) -> Result<Json<GetWork>,(StatusCode, Json<serde_json::Value>)>{
    let mut work = get_work_by_slug_handler(&state.db, slug).await.map_err(|e| database_error(e))?;

    let image_url = state.storage.public_url(&work.image);

    let _ = mem::replace(&mut work.image, image_url);

    Ok(Json(work))

}

pub async fn create_work(State(state): State<Arc<AppState>>, mut multipart: Multipart) -> Result<( StatusCode, Json<Work>),(StatusCode, Json<serde_json::Value>)>{
    let mut title :Option<String> = None;
    let mut description :Option<String> = None;
    let mut year :Option<i16> = None;
    let mut art_type:Option<String> = None;
    let mut collection_id:Option<i32> = None;
    let mut medium_id:Option<i32> = None;
    let mut content_type : Option<String> = None;
    let mut key : Option<String> = None;
    let mut bytes: Option<bytes::Bytes> = None;

    while let Some(field) = multipart.next_field().await.unwrap() {
        match Some(field.name().unwrap_or("")) {
            Some("title") => {
                title = Some(field.text().await.map_err(|_| bad_request_error("invalid title") )?);
            }
            Some("description") => {
                description = Some(field.text().await.map_err(|_| bad_request_error("invalid description") )?);
            }
            Some("year") => {
                let text = Some(field.text().await.map_err(|_| bad_request_error("invalid year"))?);
                year = Some(text.unwrap().parse::<i16>().map_err(|_| bad_request_error("year must be a number"))?);
            }
            Some("art_type") => {
                art_type = Some(field.text().await.map_err(|_| bad_request_error("invalid art_type"))?);
            }
            Some("collection_id") => {
                let text = Some(field.text().await.map_err(|_| bad_request_error("invalid collection_id"))?);
                collection_id = Some(text.unwrap().parse::<i32>().map_err(|_| bad_request_error("invalid collection_id"))?);
            }
            Some("medium_id") => {
                let text = Some(field.text().await.map_err(|_| bad_request_error("invalid medium_id"))?);
                medium_id = Some(text.unwrap().parse::<i32>().map_err(|_| bad_request_error("invalid medium_id"))?);
            }
            Some("image") => {
                content_type = Some(field.content_type().ok_or_else(|| bad_request_error("missing image content type"))?.to_string());

                key = Some(format!("art/{}",uuid::Uuid::new_v4().to_string()));
                bytes = Some(field.bytes().await.map_err(|_| internal_server_error("Multipart byte error"))?);
            }

            _ => {}
        }
    }

    let title = title.ok_or_else(|| println!("title is required")).unwrap();
    let year = year.ok_or_else(|| println!("year is required")).unwrap();
    let art_type = art_type.ok_or_else(|| println!("art_type is required")).unwrap();
    let key = key.ok_or_else(|| println!("image is required")).unwrap();
    let content_type = content_type.ok_or_else(|| println!("image is required")).unwrap();
    let bytes = bytes.ok_or_else(|| println!("image is required")).unwrap();

    match art_type.as_str() {
        "digital" if collection_id.is_none() => {
            return Err(bad_request_error("digital work requires a collection_id"));
        }
        "traditional" if medium_id.is_none() => {
            return Err(bad_request_error("traditional work requires a medium_id"));
        }
        "digital" | "traditional" => {}
        _ => return Err(bad_request_error("art type must be digital or traditional"))
    }

    let existing_work = sqlx::query_as!(Work, "SELECT * FROM works WHERE title = $1", title)
        .fetch_optional(&state.db)
        .await
        .map_err(|e| database_error(e))?;

    if existing_work.is_some(){
        return Err(conflict_error("Work already exists"))
    }
    let slug = generate_unique_slug(&title, &state.db, "works")
        .await
        .map_err(|e| database_error(e))?;

    let work = sqlx::query_as!(Work, "INSERT INTO works (title, slug, description, year, image, art_type, collection_id, medium_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        title, slug, description, year, key, art_type, collection_id, medium_id, Utc::now(), Utc::now())
        .fetch_one(&state.db)
        .await
        .map_err(|_| internal_server_error("Failed to create work"))?;

    state.storage.put_object(&key, bytes.to_vec(),&content_type).await.map_err(|_| internal_server_error("Failed to upload image"))?;
    Ok((StatusCode::CREATED, Json(work)))
}

pub async fn update_work(State(state): State<Arc<AppState>>, Path(slug): Path<String>, Json(body): Json<UpdateWork>)
-> Result<(StatusCode, Json<Work>), (StatusCode, Json<serde_json::Value>)> {
    let existing_work = sqlx::query_as!(Work, "SELECT * FROM works WHERE slug = $1", slug)
        .fetch_optional(&state.db)
        .await
        .map_err(|e| database_error(e))?;


    if let Some(existing) = existing_work{
        let new_title = body.title.as_deref();

        let new_slug = match new_title {
            Some(name) if name != existing.title => {
                generate_unique_slug(name, &state.db, "works")
                    .await
                    .map_err(|e| database_error(e))?
            }
            _ => existing.slug.clone(),
        };

        let final_title = new_title.unwrap_or(&existing.title);
        let new_description = body.description.or(existing.description);
        let new_year = body.year.or(Some(existing.year));


        sqlx::query_as!(Work, "UPDATE works SET title=$1, slug=$2, description=$3, year=$4, updated_at=$5 WHERE slug=$6 RETURNING *",
            final_title, new_slug, new_description, new_year, Utc::now(),slug)
            .fetch_one(&state.db)
            .await
            .map(|c| (StatusCode::OK, Json(c)))
            .map_err(|_| internal_server_error("Failed to update work"))
    } else {
        Err(not_found_error("work does not exist"))

    }

}

pub async fn delete_work(State(state): State<Arc<AppState>>, Path(slug): Path<String>) -> Result<(StatusCode, Json<Work>), (StatusCode, Json<serde_json::Value>)> {
    let existing_work = sqlx::query_as!(Work, "SELECT * FROM works WHERE slug = $1", slug)
        .fetch_optional(&state.db)
        .await
        .map_err(|e| database_error(e))?;

    if let Some(work) = existing_work {
        sqlx::query_as!(Work, "DELETE FROM works WHERE id = $1 RETURNING *", work.id)
            .fetch_one(&state.db)
            .await
            .map_err(|_| internal_server_error("Failed to delete medium"))?;

        state.storage.remove_object(&work.image).await.map_err(|_| internal_server_error("Failed to delete image"))?;

        Ok((StatusCode::OK, Json(work)))
    } else {
        Err(not_found_error("work does not exist"))
    }
}