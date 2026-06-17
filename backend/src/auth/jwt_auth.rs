use std::sync::Arc;
use axum::extract::{State, Request};
use axum::http::{header, StatusCode};
use axum::Json;
use axum::middleware::Next;
use axum::response::{IntoResponse};
use axum_extra::extract::CookieJar;
use jsonwebtoken::{decode, DecodingKey, Validation};
use serde::Serialize;
use crate::AppState;
use crate::auth::model::TokenClaims;

#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    pub status: &'static str,
    pub message: String,
}


pub async fn auth(
    cookie_jar: CookieJar,
    State(data): State<Arc<AppState>>,
    mut req: Request,
    next: Next,
) -> Result<impl IntoResponse, (StatusCode, Json<ErrorResponse>)> {
    let token = cookie_jar
        .get("token")
        .map(|cookie| cookie.value().to_string())
        .or_else(|| {
            req.headers()
                .get(header::AUTHORIZATION)
                .and_then(|auth_header| auth_header.to_str().ok())
                .and_then(|auth_value| {
                    if auth_value.starts_with("Bearer ") {
                        Some(auth_value[7..].to_owned())
                    } else {
                        None
                    }
                })
        });

    let token = token.ok_or_else(|| {
        let json_error = ErrorResponse {
            status: "fail",
            message: "You are not logged in, please provide token".to_string(),
        };
        (StatusCode::UNAUTHORIZED, Json(json_error))
    })?;

    let claims = decode::<TokenClaims>(
        &token,
        &DecodingKey::from_secret(data.env.jwt_secret.as_ref()),
        &Validation::default(),
    )
        .map_err(|_| {
            let json_error = ErrorResponse {
                status: "fail",
                message: "Invalid token".to_string(),
            };
            (StatusCode::UNAUTHORIZED, Json(json_error))
        })?
        .claims;

    if claims.sub != data.env.admin_username {
        return Err((
            StatusCode::UNAUTHORIZED,
            Json(ErrorResponse {
                status: "fail",
                message: "Invalid token".to_string(),
            }),
        ));
    }

    req.extensions_mut().insert(claims.sub);
    Ok(next.run(req).await)
}