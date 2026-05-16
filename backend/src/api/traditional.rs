use axum::extract::State;
use axum::http::StatusCode;
use axum::Json;
use serde::Serialize;
use sqlx::{FromRow, PgPool};

#[derive(Debug, FromRow, Serialize)]
pub struct TraditionalDisplay{
    pub id: i32,
    pub title: String,
    pub slug: String,
    pub image: String,
    pub medium: String
}

async fn get_all_traditional_handler(pool: &PgPool) -> Result<Vec<TraditionalDisplay>,sqlx::Error>{
    sqlx::query_as::<_,TraditionalDisplay>("SELECT works.id, works.title, works.slug, works.image, mediums.name AS medium FROM works
    LEFT JOIN mediums ON mediums.id = works.medium_id WHERE works.art_type='traditional'")
        .fetch_all(pool)
        .await
}

pub async fn get_all_traditional(State(pool):State<PgPool>) -> Result<Json<Vec<TraditionalDisplay>>,StatusCode>{
    get_all_traditional_handler(&pool).await.map(Json).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}