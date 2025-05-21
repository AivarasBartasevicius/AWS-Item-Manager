resource "aws_s3_bucket" "user_item_filters" {
  bucket = "user-item-filters"

  tags = {
    Name        = "user-item-filters"
    Environment = "dev"
  }
}

resource "aws_s3_bucket_versioning" "user_item_filters_versioning" {
  bucket = aws_s3_bucket.user_item_filters.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "allow_public_policy" {
  bucket                  = aws_s3_bucket.user_item_filters.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "public_read_policy" {
  bucket = aws_s3_bucket.user_item_filters.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid       = "PublicReadGetObject",
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "arn:aws:s3:::user-item-filters/*"
      }
    ]
  })
}
