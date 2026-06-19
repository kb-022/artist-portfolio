use std::mem;
use std::sync::Arc;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool};
use axum::Json;
use chrono::Utc;
use crate::api::error::{conflict_error, database_error, internal_server_error, not_found_error};
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
pub struct UpdateWork{
    pub title: String,
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

//pub async fn create_work

pub async fn update_work(State(state): State<Arc<AppState>>, Path(slug): Path<String>, Json(body): Json<UpdateWork>)
-> Result<(StatusCode, Json<Work>), (StatusCode, Json<serde_json::Value>)> {
    let existing_work = sqlx::query_as!(Work, "SELECT * FROM works WHERE slug = $1", slug)
        .fetch_optional(&state.db)
        .await
        .map_err(|e| database_error(e))?;


    if let Some(existing) = existing_work{
        let existing_title = sqlx::query_as!(Work, "SELECT * FROM works WHERE title = $1", body.title)
            .fetch_optional(&state.db)
            .await
            .map_err(|e| database_error(e))?;

        if existing_title.is_some(){
            return Err(conflict_error("title already exists"));
        }

        let new_slug = generate_unique_slug(&body.title, &state.db, "works")
            .await
            .map_err(|e| database_error(e))?;

        let new_description = body.description.or(existing.description);
        let new_year = body.year.or(Option::from(existing.year));


        sqlx::query_as!(Work, "UPDATE works SET title=$1, slug=$2, description=$3, year=$4, updated_at=$5 WHERE slug=$6 RETURNING *", body.title, new_slug, new_description, new_year, Utc::now(),slug)
            .fetch_one(&state.db)
            .await
            .map(|c| (StatusCode::OK, Json(c)))
            .map_err(|_| internal_server_error("Failed to update work"))
    } else {
        Err(not_found_error("work does not exist"))

    }

}