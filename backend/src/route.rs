use std::sync::Arc;
use axum::{middleware, Router};
use axum::extract::DefaultBodyLimit;
use axum::routing::{get, patch, post};
use tower_governor::governor::GovernorConfigBuilder;
use tower_governor::GovernorLayer;
use tower_governor::key_extractor::SmartIpKeyExtractor;
use tower_http::limit::RequestBodyLimitLayer;
use crate::api::collections::{create_collection, delete_collection, get_all_collections, get_collection_by_slug, update_collection, update_collection_cover};
use crate::api::mediums::{create_medium, delete_medium, get_all_mediums, update_medium};
use crate::api::traditional::get_all_traditional;
use crate::api::works::{create_work, delete_work, get_all_works, get_all_works_in_collection, get_work_by_slug, update_work};
use crate::{root, AppState};
use crate::auth::handler::{get_me_handler, login_user_handler, logout_handler};
use crate::auth::jwt_auth::auth;

pub fn create_router(app_state: Arc<AppState>) -> Router {
    let login_governor_conf = Arc::new(
        GovernorConfigBuilder::default()
            .per_second(1)
            .burst_size(5)
            .key_extractor(SmartIpKeyExtractor)
            .finish()
            .unwrap(),
    );

    Router::new()
        //unrestricted routes
        .route("/api",get(root))
        .route("/api/collections",get(get_all_collections))
        .route("/api/collections/{slug}",get(get_collection_by_slug))
        .route("/api/collections/{slug}/works",get(get_all_works_in_collection))
        .route("/api/traditional",get(get_all_traditional))
        .route("/api/mediums",get(get_all_mediums))
        .route("/api/works/{slug}",get(get_work_by_slug))
        .route("/api/works", get(get_all_works))

        //auth handling
        .route("/api/auth/login", post(login_user_handler).route_layer(GovernorLayer::new(login_governor_conf)))
        .route("/api/auth/logout", get(logout_handler).route_layer(middleware::from_fn_with_state(app_state.clone(), auth)))
        .route("/api/users/me", get(get_me_handler).route_layer(middleware::from_fn_with_state(app_state.clone(), auth)))

        //authenticated routes
        .route("/api/admin/mediums", post(create_medium).route_layer(middleware::from_fn_with_state(app_state.clone(), auth)))
        .route("/api/admin/mediums/{slug}", patch(update_medium).delete(delete_medium).route_layer(middleware::from_fn_with_state(app_state.clone(), auth)))
        .route("/api/admin/collections", post(create_collection).route_layer(middleware::from_fn_with_state(app_state.clone(), auth)))
        .route("/api/admin/collections/{slug}", patch(update_collection).delete(delete_collection).route_layer(middleware::from_fn_with_state(app_state.clone(), auth)))
        .route("/api/admin/collections/{slug}/cover", patch(update_collection_cover).route_layer(middleware::from_fn_with_state(app_state.clone(), auth)))
        .route("/api/admin/works", post(create_work).route_layer(middleware::from_fn_with_state(app_state.clone(), auth)))
        .route("/api/admin/works/{slug}", patch(update_work).delete(delete_work).route_layer(middleware::from_fn_with_state(app_state.clone(), auth)))
        .layer(DefaultBodyLimit::disable())
        .layer(RequestBodyLimitLayer::new(20 * 1024 * 1024))
        .with_state(app_state)
}