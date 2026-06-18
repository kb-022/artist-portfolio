use sqlx::PgPool;

pub async fn generate_unique_slug(name: &str, pool: &PgPool, table_name: &str) -> Result<String, sqlx::Error> {
    let slug = slug::slugify(name);

    let query = format!("SELECT COUNT(*) FROM {} WHERE slug = $1", table_name);
    let existing_slug : (i64,) = sqlx::query_as(&query)
    .bind(&slug)
    .fetch_one(pool)
        .await?;

    if existing_slug.0 == 0 {
        return Ok(slug);
    }

    let mut counter = 2;
    loop {
        let slug_to_try = format!("{}-{}", slug, counter);

        let existing_slug : (i64,) = sqlx::query_as(&query)
            .bind(&slug_to_try)
            .fetch_one(pool)
            .await?;

        if existing_slug.0 == 0 {
            return Ok(slug);
        }

        counter += 1;

    }
}



