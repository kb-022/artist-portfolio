use std::sync::Arc;
use axum::extract::State;
use axum::http::StatusCode;
use axum::Json;
use serde::Serialize;
use sqlx::{FromRow, PgPool};
use crate::AppState;

#[derive(Debug,Serialize,FromRow)]
pub struct Medium{
    pub id: i16,
    pub name: String,
    pub slug: String,
}


async fn get_all_mediums_handler(pool: &PgPool) -> Result<Vec<Medium>,sqlx::Error>{
    sqlx::query_as!(Medium,"SELECT * FROM mediums")
    .fetch_all(pool)
    .await
}

pub async fn get_all_mediums(State(state): State<Arc<AppState>>) ->  Result<Json<Vec<Medium>>, StatusCode>{
    get_all_mediums_handler(&state.db).await.map(Json).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}