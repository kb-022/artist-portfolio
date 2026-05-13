use axum::routing::{get, post};
use axum::Router;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/",get(root));


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