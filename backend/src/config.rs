#[derive(Debug,Clone)]
pub struct Config{
    pub database_url: String,
    pub jwt_secret: String,
    pub jwt_expires_in: i32,
    pub jwt_max_age: i32,
    pub admin_username: String,
    pub admin_password: String,
    pub s3_access_key: String,
    pub s3_secret_key: String,
    pub s3_bucket_name: String,
    pub s3_public_bucket_url: String,
    pub s3_endpoint_url: String,
    pub s3_region: String,
}

impl Config {
    pub fn init() -> Config{
        let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        let jwt_secret = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set");
        let jwt_expires_in = std::env::var("JWT_EXPIRES_IN").expect("JWT_EXPIRES_IN must be set");
        let jwt_max_age = std::env::var("JWT_MAX_AGE").expect("JWT_MAX_AGE must be set");
        let admin_username = std::env::var("ADMIN_USER").expect("ADMIN_USER must be set");
        let admin_password = std::env::var("ADMIN_PASSWORD").expect("ADMIN_PASSWORD must be set");
        let s3_access_key = std::env::var("S3_ACCESS_KEY").expect("S3_ACCESS_KEY must be set");
        let s3_secret_key = std::env::var("S3_SECRET_KEY").expect("S3_SECRET_KEY must be set");
        let s3_bucket_name = std::env::var("S3_BUCKET_NAME").expect("S3_BUCKET_NAME must be set");
        let s3_public_bucket_url = std::env::var("S3_PUBLIC_BUCKET_URL").expect("S3_PUBLIC_BUCKET_URL must be set");
        let s3_endpoint_url = std::env::var("S3_ENDPOINT_URL").expect("S3_ENDPOINT_URL must be set");
        let s3_region = std::env::var("S3_REGION").expect("S3_REGION must be set");

        Config{
            database_url,
            jwt_secret,
            jwt_expires_in: jwt_expires_in.parse::<i32>().unwrap(),
            jwt_max_age: jwt_max_age.parse::<i32>().unwrap(),
            admin_username,
            admin_password,
            s3_access_key,
            s3_secret_key,
            s3_bucket_name,
            s3_public_bucket_url,
            s3_endpoint_url,
            s3_region,
        }
    }
}
