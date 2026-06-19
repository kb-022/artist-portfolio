use aws_config::{BehaviorVersion, Region};
use aws_sdk_s3::{
    config::{Credentials, SharedCredentialsProvider},
    Client,
};
use aws_sdk_s3::config::Builder;
use aws_sdk_s3::config::http::HttpResponse;
use aws_sdk_s3::error::SdkError;
use aws_sdk_s3::operation::put_object::{PutObjectError, PutObjectOutput};
use crate::config::Config;

#[derive(Clone)]
pub(crate) struct Storage {
    pub client: Client,
    pub bucket_name: String,
    pub public_bucket_url: String,
}



impl Storage{
    pub async fn init(config: &Config) -> Self{
        let endpoint_url = config.s3_endpoint_url.clone();

        let credentials = Credentials::new(config.s3_access_key.clone(), config.s3_secret_key.clone(), None, None,"custom");

        let sdk_config = aws_config::defaults(BehaviorVersion::latest())
            .region(Region::new(config.s3_region.clone()))
            .credentials_provider(SharedCredentialsProvider::new(credentials))
            .endpoint_url(&endpoint_url)
        .load()
        .await;

        let r2_config = Builder::from(&sdk_config)
            .force_path_style(true)
            .build();

        let client = Client::from_conf(r2_config);

        Storage{
            client,
            bucket_name: config.s3_bucket_name.clone(),
            public_bucket_url: config.s3_public_bucket_url.clone(),
        }
    }

    pub async fn put_object(&self, key: &str, bytes: Vec<u8>) -> Result<PutObjectOutput, SdkError<PutObjectError, HttpResponse>> {
        let body = aws_sdk_s3::primitives::ByteStream::from(bytes);
        self.client
        .put_object()
        .bucket(&self.bucket_name)
        .key(key)
        .body(body)
        .send()
        .await

    }

    pub async fn remove_object(&self, key: &str) -> Result<(), Box<dyn std::error::Error>> {
        self.client
            .delete_object()
        .bucket(&self.bucket_name)
        .key(key)
        .send()
        .await?;

        Ok(())
    }

    pub fn public_url(&self, key: &str) -> String{
        format!("{}/{}", self.public_bucket_url.trim_end_matches("/"), key.trim_start_matches("/"))
    }
}