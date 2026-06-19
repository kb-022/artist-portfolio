use std::sync::Arc;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::Json;
use serde::Serialize;
use sqlx::{FromRow, PgPool};
use crate::api::error::database_error;
use crate::AppState;

#[derive(Debug, Serialize, FromRow)]
pub struct CollectionAll {
    pub id: i32,
    pub name: String,
    pub slug: String,
    pub cover_work_id: Option<i32>,
}
#[derive(Debug, Serialize, FromRow)]
pub struct CollectionSingle {
    pub id: i32,
    pub name: String,
    pub slug: String,
    pub description: Option<String>,
}

#[derive(Debug, FromRow, Serialize)]
pub struct CollectionDisplay{
    pub id: i32,
    pub title: String,
    pub slug: String,
    pub cover_work_id: i32,
}

 async fn get_all_collections_handler(pool: &PgPool) -> Result<Vec<CollectionAll>,sqlx::Error> {
    sqlx::query_as!(CollectionAll,"SELECT id, name, slug, cover_work_id FROM collections")
     .fetch_all(pool)
     .await
}

pub async fn get_all_collections(State(state): State<Arc<AppState>>) -> Result<Json<Vec<CollectionAll>>, (StatusCode, Json<serde_json::Value>)> {
    get_all_collections_handler(&state.db).await.map(Json).map_err(|e| database_error(e))
}

async fn get_collection_by_slug_handler(pool: &PgPool, slug: String) -> Result<CollectionSingle, sqlx::Error> {
    sqlx::query_as!(CollectionSingle,"SELECT id,name,slug,description FROM collections WHERE slug = $1",slug)
        .fetch_one(pool)
    .await
}

pub async fn get_collection_by_slug(State(state): State<Arc<AppState>>, Path(slug): Path<String>) -> Result<Json<CollectionSingle>, StatusCode> {
    get_collection_by_slug_handler(&state.db, slug).await.map(Json).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

async fn get_all_works_in_collection_handler(pool: &PgPool, slug: String) -> Result<Vec<CollectionDisplay>,sqlx::Error> {
    sqlx::query_as::<_,CollectionDisplay>("SELECT works.id,works.title,works.slug,works.image FROM works
LEFT JOIN collections ON collections.id = works.collection_id
WHERE collections.slug = $1")
        .bind(slug)
    .fetch_all(pool)
    .await
}

pub async fn get_all_works_in_collection(State(state): State<Arc<AppState>>, Path(slug): Path<String>) -> Result<Json<Vec<CollectionDisplay>>,StatusCode> {
    get_all_works_in_collection_handler(&state.db, slug).await.map(Json).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

