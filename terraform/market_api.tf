resource "aws_lambda_function" "market_api" {
  function_name = "market_api"

  package_type = "Image"
  image_uri    = "911197153746.dkr.ecr.eu-north-1.amazonaws.com/lambda/market_api:latest"

  role = aws_iam_role.item_manager.arn

  architectures = ["arm64"]
}

resource "aws_cloudwatch_log_group" "market_api" {
  name = "/aws/lambda/${aws_lambda_function.market_api.function_name}"

  retention_in_days = 7
}
