resource "aws_dynamodb_table" "user" {
  name         = "user"
  billing_mode = "PROVISIONED"

  read_capacity  = 1
  write_capacity = 1

  hash_key  = "userId"
  range_key = "userObjectId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "userObjectId"
    type = "S"
  }

}

resource "aws_appautoscaling_target" "user_read_target" {
  max_capacity       = 2000
  min_capacity       = 1
  resource_id        = "table/${aws_dynamodb_table.user.name}"
  scalable_dimension = "dynamodb:table:ReadCapacityUnits"
  service_namespace  = "dynamodb"
}

resource "aws_appautoscaling_policy" "user_read_policy" {
  name               = "read-scaling-policy"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.user_read_target.resource_id
  scalable_dimension = aws_appautoscaling_target.user_read_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.user_read_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBReadCapacityUtilization"
    }

    target_value = 70.0
  }
}

resource "aws_appautoscaling_target" "user_write_target" {
  max_capacity       = 1000
  min_capacity       = 1
  resource_id        = "table/${aws_dynamodb_table.user.name}"
  scalable_dimension = "dynamodb:table:WriteCapacityUnits"
  service_namespace  = "dynamodb"
}

resource "aws_appautoscaling_policy" "user_write_policy" {
  name               = "write-scaling-policy"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.user_write_target.resource_id
  scalable_dimension = aws_appautoscaling_target.user_write_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.user_write_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBWriteCapacityUtilization"
    }

    target_value = 70.0
  }
}
