use std::sync::Arc;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use serde::Serialize;
use sqlx::{FromRow, PgPool};
use axum::Json;
use crate::AppState;

#[derive(Debug, Serialize, FromRow)]
pub struct Work {
    pub id: i32,
    pub title: String,
    pub slug: String,
    pub description: Option<String>,
    pub year: i16,
    pub image: String,
    pub collection_medium_name: String,
    pub art_type: String,
}

async fn get_work_by_slug_handler(pool: &PgPool,slug: String) -> Result<Work,sqlx::Error> {
    sqlx::query_as::<_,Work>("SELECT works.id, works.title, works.slug, works.description, works.year, works.image, works.art_type,
    COALESCE(collections.name,mediums.name) AS collection_medium_name
    FROM works
    LEFT JOIN collections ON collections.id = works.collection_id
    LEFT JOIN mediums ON mediums.id = works.medium_id
    WHERE works.slug = $1")
    .bind(slug)
    .fetch_one(pool)
    .await
}

pub async fn get_work_by_slug(State(state): State<Arc<AppState>>, Path(slug): Path<String>) -> Result<Json<Work>,StatusCode>{
    get_work_by_slug_handler(&state.db, slug).await.map(Json).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}