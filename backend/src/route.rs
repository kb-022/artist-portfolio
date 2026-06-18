use std::sync::Arc;
use axum::{middleware, Router};
use axum::routing::{get, patch, post};
use tower_http::services::ServeDir;
use crate::api::collections::{get_all_collections, get_all_works_in_collection, get_collection_by_slug};
use crate::api::mediums::{create_medium, delete_medium, get_all_mediums, update_medium};
use crate::api::traditional::get_all_traditional;
use crate::api::works::get_work_by_slug;
use crate::{root, AppState};
use crate::auth::handler::{get_me_handler, login_user_handler, logout_handler};
use crate::auth::jwt_auth::auth;

pub fn create_router(app_state: Arc<AppState>) -> Router {
    Router::new()
        //unrestricted routes
        .route("/api",get(root))
        .route("/api/collections",get(get_all_collections))
        .route("/api/collections/{slug}",get(get_collection_by_slug))
        .route("/api/collections/{slug}/works",get(get_all_works_in_collection))
        .route("/api/traditional",get(get_all_traditional))
        .route("/api/mediums",get(get_all_mediums))
        .route("/api/works/{slug}",get(get_work_by_slug))

        .route("/api/auth/login", post(login_user_handler))
        .route("/api/auth/logout", get(logout_handler).route_layer(middleware::from_fn_with_state(app_state.clone(), auth)))
        .route("/api/users/me", get(get_me_handler).route_layer(middleware::from_fn_with_state(app_state.clone(), auth)))

        .route("/api/admin/mediums", post(create_medium).route_layer(middleware::from_fn_with_state(app_state.clone(), auth)))
        .route("/api/admin/mediums/{slug}", patch(update_medium).delete(delete_medium).route_layer(middleware::from_fn_with_state(app_state.clone(), auth)))


        //Static asset folder (temp) - swap to S3 compatible for better practices
        .nest_service("/art",ServeDir::new("art"))
        .with_state(app_state)
}