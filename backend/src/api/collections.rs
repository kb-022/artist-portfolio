use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::Json;
use serde::Serialize;
use sqlx::{FromRow, PgPool};

#[derive(Debug, Serialize, FromRow)]
pub struct CollectionAll {
    pub id: i16,
    pub name: String,
    pub slug: String,
    pub cover_image: String,
}
#[derive(Debug, Serialize, FromRow)]
pub struct CollectionSingle {
    pub id: i16,
    pub name: String,
    pub slug: String,
    pub description: String,
}

 async fn get_all_collections_handler(pool: &PgPool) -> Result<Vec<CollectionAll>,sqlx::Error> {
    sqlx::query_as::<_, CollectionAll>("SELECT id,name,slug,cover_image FROM collections")
        .fetch_all(pool)
        .await
}

pub async fn get_all_collections(State(pool): State<PgPool>) -> Result<Json<Vec<CollectionAll>>, StatusCode> {
    get_all_collections_handler(&pool).await.map(Json).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

async fn get_collection_by_slug_handler(pool: &PgPool, slug: String) -> Result<CollectionSingle, sqlx::Error> {
    sqlx::query_as::<_, CollectionSingle>("SELECT id,name,slug,description FROM collections WHERE slug = $1")
    .bind(slug)
    .fetch_one(pool)
    .await
}

pub async fn get_collection_by_slug(State(pool): State<PgPool>, Path(slug): Path<String>) -> Result<Json<CollectionSingle>, StatusCode> {
    get_collection_by_slug_handler(&pool, slug).await.map(Json).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}
