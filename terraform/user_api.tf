resource "aws_lambda_function" "user_api" {
  package_type = "Image"
  image_uri    = "911197153746.dkr.ecr.eu-north-1.amazonaws.com/lambda/user_api:latest"

  function_name = "user_api"

  role = aws_iam_role.item_manager.arn
}

resource "aws_cloudwatch_log_group" "user_api" {
  name = "/aws/lambda/${aws_lambda_function.user_api.function_name}"

  retention_in_days = 7
}
