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

resource "aws_iam_role" "item_manager" {
  name = "lambda-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_lambda_permission" "allow_apigw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.user_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.user.execution_arn}/*/*"
}
