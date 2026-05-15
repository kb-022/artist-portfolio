mod api;

use std::env;
use axum::routing::{get, post};
use axum::Router;
use dotenv;
use sqlx::postgres::PgPoolOptions;
use crate::api::collections::{get_all_collections, get_collection_by_slug};
use crate::api::mediums::get_all_mediums;

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL is not set in .env file");

    let pool = PgPoolOptions::new().connect(&db_url).await.expect("Database connection failed");

    sqlx::migrate!().run(&pool).await.expect("Migrations failed");


    let app = Router::new()
        .route("/api",get(root))
        .route("/api/collections",get(get_all_collections))
        .route("/api/collections/{slug}",get(get_collection_by_slug))
        .route("/api/mediums",get(get_all_mediums))
        .with_state(pool);


    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .expect("Failed to bind");

    println!("Listening on: {}", listener.local_addr().unwrap());

    axum::serve(listener,app)
        .await
        .expect("Failed to run server");
}

async fn root() -> &'static str {
    "Backend API"
}