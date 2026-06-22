use axum::http::StatusCode;
use axum::Json;
use sqlx::Error;

pub fn database_error (e: Error) -> (StatusCode, Json<serde_json::Value>){
    (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"status":"error", "message" : format!("{:?}",e)})))
}

pub fn conflict_error (msg: &str) -> (StatusCode, Json<serde_json::Value>){
    (StatusCode::CONFLICT, Json(serde_json::json!({"status":"error","message": msg})))
}

pub fn internal_server_error (msg: &str) -> (StatusCode, Json<serde_json::Value>){
    (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"status":"error","message": msg})))
}

pub fn not_found_error (msg: &str) -> (StatusCode, Json<serde_json::Value>){
    (StatusCode::NOT_FOUND, Json(serde_json::json!({"status":"error","message": msg})))
}

pub fn bad_request_error (msg: &str) -> (StatusCode, Json<serde_json::Value>){
    (StatusCode::BAD_REQUEST, Json(serde_json::json!({"status":"error","message": msg})))
}