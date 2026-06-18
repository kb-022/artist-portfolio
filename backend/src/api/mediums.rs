use std::sync::Arc;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::Json;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool};
use crate::api::utils::generate_unique_slug;
use crate::AppState;

#[derive(Debug,Serialize,FromRow)]
pub struct Medium{
    pub id: i16,
    pub name: String,
    pub slug: String,
}

#[derive(Deserialize)]
pub struct CreateMedium{
    pub name: String,
}


async fn get_all_mediums_handler(pool: &PgPool) -> Result<Vec<Medium>,sqlx::Error>{
    sqlx::query_as!(Medium,"SELECT * FROM mediums")
    .fetch_all(pool)
    .await
}

pub async fn get_all_mediums(State(state): State<Arc<AppState>>) ->  Result<Json<Vec<Medium>>, StatusCode>{
    get_all_mediums_handler(&state.db).await.map(Json).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

pub async fn create_medium(State(state): State<Arc<AppState>>, Json(medium): Json<CreateMedium>) -> Result<(StatusCode, Json<Medium>),(StatusCode, Json<serde_json::Value>)> {
    let existing_medium = sqlx::query_as!(Medium, "SELECT * FROM mediums WHERE name = $1", medium.name)
        .fetch_optional(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"status":"error", "message" : format!("{:?}",e)}))))?;

    if existing_medium.is_some(){
        return Err((StatusCode::CONFLICT, Json(serde_json::json!({"status":"error","message":"Medium already exists"}))));
    }

    let slug = generate_unique_slug(&medium.name, &state.db, "mediums")
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"status":"error", "message" : format!("{:?}",e)}))))?;

    sqlx::query_as!(Medium, "INSERT INTO mediums (name, slug) VALUES ($1, $2) RETURNING *", medium.name, slug)
        .fetch_one(&state.db)
        .await
        .map(|med| (StatusCode::CREATED, Json(med)))
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"status":"error", "message" : "Failed to create medium"}))))
}

pub async fn update_medium(State(state): State<Arc<AppState>>, Path(slug): Path<String>,Json(medium): Json<CreateMedium>) -> Result<(StatusCode, Json<Medium>), (StatusCode, Json<serde_json::Value>)>{
    let existing_medium = sqlx::query_as!(Medium, "SELECT * FROM mediums WHERE slug = $1", slug)
        .fetch_optional(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"status":"error", "message" : format!("{:?}",e)}))))?;


    if existing_medium.is_some(){
        let existing_name = sqlx::query_as!(Medium, "SELECT * FROM mediums WHERE name = $1", medium.name)
            .fetch_optional(&state.db)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"status":"error", "message" : format!("{:?}",e)}))))?;

        if existing_name.is_some(){
            return Err((StatusCode::CONFLICT, Json(serde_json::json!({"status":"error","message":"name already exists"}))));
        }

        let new_slug = generate_unique_slug(&medium.name, &state.db, "mediums")
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"status":"error", "message" : format!("{:?}",e)}))))?;


        sqlx::query_as!(Medium, "UPDATE mediums SET name=$1, slug=$2 WHERE slug=$3 RETURNING *", medium.name, new_slug, slug)
            .fetch_one(&state.db)
            .await
            .map(|med| (StatusCode::CREATED, Json(med)))
            .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"status":"error", "message" : "Failed to update medium"}))))
    } else {
       Err((StatusCode::CONFLICT, Json(serde_json::json!({"status":"error","message":"medium does not exist"}))))

    }

}

pub async fn delete_medium(State(state): State<Arc<AppState>>, Path(slug): Path<String>) -> Result<(StatusCode, Json<Medium>), (StatusCode, Json<serde_json::Value>)>{
    let existing_medium = sqlx::query_as!(Medium, "SELECT * FROM mediums WHERE slug = $1", slug)
        .fetch_optional(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"status":"error", "message" : format!("{:?}",e)}))))?;

    if existing_medium.is_some(){
        let medium_id = existing_medium.unwrap().id;

        let works_count = sqlx::query!("SELECT COUNT(*) as count FROM works WHERE medium_id = $1", medium_id)
            .fetch_one(&state.db)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"status":"error", "message" : format!("{:?}",e)}))))?;

        if works_count.count.unwrap() > 0 {
            return Err((StatusCode::CONFLICT, Json(serde_json::json!({"status":"error","message": format!("Delete {} works attached to medium first",works_count.count.unwrap())}))));
        }

        sqlx::query_as!(Medium, "DELETE FROM mediums WHERE id = $1 RETURNING *", medium_id)
            .fetch_one(&state.db)
        .await
            .map(|med| (StatusCode::CREATED, Json(med)))
            .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"status":"error", "message" : "Failed to delete medium"}))))
    }else {
        Err((StatusCode::CONFLICT, Json(serde_json::json!({"status":"error","message":"medium does not exist"}))))

    }
}


