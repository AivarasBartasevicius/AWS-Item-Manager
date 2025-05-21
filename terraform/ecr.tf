resource "aws_ecr_repository" "user_api_repo" {
  name                 = "lambda/user_api"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "market_api_repo" {
  name                 = "lambda/market_api"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}
