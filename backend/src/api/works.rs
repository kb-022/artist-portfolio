use serde::Serialize;
use sqlx::FromRow;

#[derive(Debug, Serialize, FromRow)]
pub struct Work {
    pub id: i32,
    pub title: String,
    pub slug: String,
    pub description: String,
    pub year: i32,
    pub image: String,
    pub art_type: String,
    pub collection_id: Option<i16>,
    pub medium_id: Option<i16>,
}

