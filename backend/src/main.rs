mod api;
mod auth;
mod config;
mod route;

use crate::config::Config;
use crate::route::create_router;
use axum::http::header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE};
use axum::http::{HeaderValue, Method};
use dotenv;
use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres};
use std::sync::Arc;
use tower_http::cors::{CorsLayer};

pub struct AppState {
    db: Pool<Postgres>,
    env: Config,
}

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();

    let config = Config::init();

    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&config.database_url)
        .await
        .expect("Database connection failed");

    sqlx::migrate!().run(&pool).await.expect("Migrations failed");

    let cors = CorsLayer::new()
        .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
        .allow_methods(vec![Method::GET, Method::POST, Method::PATCH, Method::DELETE])
        .allow_credentials(true)
        .allow_headers([AUTHORIZATION, ACCEPT, CONTENT_TYPE]);

    let app = create_router(Arc::new(AppState{
        db: pool.clone(),
        env: config.clone(),
    }))
        .layer(cors);


    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .expect("Failed to bind");

    println!("Listening on: {}", listener.local_addr().unwrap());

    axum::serve(listener,app.into_make_service())
        .await
        .expect("Failed to run server");
}

async fn root() -> &'static str {
    "Backend API"
}