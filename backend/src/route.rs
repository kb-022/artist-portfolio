use std::sync::Arc;
use axum::Router;
use axum::routing::get;
use tower_http::services::ServeDir;
use crate::api::collections::{get_all_collections, get_all_works_in_collection, get_collection_by_slug};
use crate::api::mediums::get_all_mediums;
use crate::api::traditional::get_all_traditional;
use crate::api::works::get_work_by_slug;
use crate::{root, AppState};

pub fn create_router(app_state: Arc<AppState>) -> Router {
    Router::new()
        .route("/api",get(root))
        .route("/api/collections",get(get_all_collections))
        .route("/api/collections/{slug}",get(get_collection_by_slug))
        .route("/api/collections/{slug}/works",get(get_all_works_in_collection))
        .route("/api/traditional",get(get_all_traditional))
        .route("/api/mediums",get(get_all_mediums))
        .route("/api/works/{slug}",get(get_work_by_slug))
        .nest_service("/art",ServeDir::new("art"))
        .with_state(app_state)
}