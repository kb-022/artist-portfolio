use crate::auth::model::{LoginRequest, TokenClaims};
use crate::AppState;
use argon2::{Argon2, PasswordHash, PasswordVerifier};
use axum::extract::State;
use axum::http::{header, Response, StatusCode};
use axum::response::IntoResponse;
use axum::{Extension, Json};
use axum_extra::extract::cookie::{Cookie, SameSite};
use jsonwebtoken::{encode, EncodingKey, Header};
use serde_json::json;
use std::sync::Arc;
use crate::api::error::internal_server_error;

pub async fn login_user_handler(
    State(data): State<Arc<AppState>>,
    Json(body): Json<LoginRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    //handle env user and password
    if body.username != data.env.admin_username {
        return Err((StatusCode::UNAUTHORIZED, Json(json!({"error": "invalid credentials"}))));
    }
    
    let admin_hash_password = PasswordHash::new(&data.env.admin_password)
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": "server misconfiguration"}))))?;

    let argon2 = Argon2::default();
    if argon2.verify_password(body.password.as_bytes(), &admin_hash_password).is_err(){
        return Err((StatusCode::UNAUTHORIZED, Json(json!({"error": "invalid credentials"}))));
    }


    let now = chrono::Utc::now();
    let iat = now.timestamp() as usize;
    let exp = (now + chrono::Duration::minutes(data.env.jwt_expires_in as i64)).timestamp() as usize;
    let claims: TokenClaims = TokenClaims{
        sub: data.env.admin_username.clone(),
        exp,
        iat
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(data.env.jwt_secret.as_ref()),
    ).map_err(|_| internal_server_error("could not create token"))?;

    let cookie = Cookie::build(("token", token.to_owned()))
        .path("/")
        .max_age(time::Duration::minutes(data.env.jwt_max_age as i64))
    .same_site(SameSite::Lax)
        .secure(false) //change to true in prod
        .http_only(true);

    let mut response = Response::new(json!({"status": "success", "token": token}).to_string());
    response
        .headers_mut()
        .insert(header::SET_COOKIE, cookie.to_string().parse().unwrap());
    Ok(response)
}

pub async fn logout_handler() -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let cookie = Cookie::build(("token", ""))
        .path("/")
        .max_age(time::Duration::hours(-1))
        .same_site(SameSite::Lax)
        .secure(false) // change to true
        .http_only(true);


    let mut response = Response::new(json!({"status": "success"}).to_string());
    response
        .headers_mut()
        .insert(header::SET_COOKIE, cookie.to_string().parse().unwrap());
    Ok(response)
}

pub async fn get_me_handler(
    Extension(user): Extension<String>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let json_response = json!({
        "status":  "success",
        "data": json!({
            "user": user
        })
    });

    Ok(Json(json_response))
}