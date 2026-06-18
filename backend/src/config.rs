#[derive(Debug,Clone)]
pub struct Config{
    pub database_url: String,
    pub jwt_secret: String,
    pub jwt_expires_in: i32,
    pub jwt_max_age: i32,
    pub admin_username: String,
    pub admin_password: String,
}

impl Config {
    pub fn init() -> Config{
        let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        let jwt_secret = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set");
        let jwt_expires_in = std::env::var("JWT_EXPIRES_IN").expect("JWT_EXPIRES_IN must be set");
        let jwt_max_age = std::env::var("JWT_MAX_AGE").expect("JWT_MAX_AGE must be set");
        let admin_username = std::env::var("ADMIN_USER").expect("ADMIN_USER must be set");
        let admin_password = std::env::var("ADMIN_PASSWORD").expect("ADMIN_PASSWORD must be set");
        Config{
            database_url,
            jwt_secret,
            jwt_expires_in: jwt_expires_in.parse::<i32>().unwrap(),
            jwt_max_age: jwt_max_age.parse::<i32>().unwrap(),
            admin_username,
            admin_password,
        }
    }
}
