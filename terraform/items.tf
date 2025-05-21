resource "aws_dynamodb_table" "item" {
  name         = "items"
  billing_mode = "PROVISIONED"

  read_capacity  = 1
  write_capacity = 1

  hash_key  = "locationId"
  range_key = "itemId"

  attribute {
    name = "locationId"
    type = "S"
  }

  attribute {
    name = "itemId"
    type = "S"
  }

}

# Auto Scaling for Read Capacity
resource "aws_appautoscaling_target" "item_read_target" {
  max_capacity       = 15000
  min_capacity       = 1
  resource_id        = "table/${aws_dynamodb_table.item.name}"
  scalable_dimension = "dynamodb:table:ReadCapacityUnits"
  service_namespace  = "dynamodb"
}

resource "aws_appautoscaling_policy" "item_read_policy" {
  name               = "read-scaling-policy"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.item_read_target.resource_id
  scalable_dimension = aws_appautoscaling_target.item_read_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.item_read_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBReadCapacityUtilization"
    }

    target_value = 70.0
  }
}

# Auto Scaling for Write Capacity
resource "aws_appautoscaling_target" "item_write_target" {
  max_capacity       = 15000
  min_capacity       = 1
  resource_id        = "table/${aws_dynamodb_table.item.name}"
  scalable_dimension = "dynamodb:table:WriteCapacityUnits"
  service_namespace  = "dynamodb"
}

resource "aws_appautoscaling_policy" "item_write_policy" {
  name               = "write-scaling-policy"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.item_write_target.resource_id
  scalable_dimension = aws_appautoscaling_target.item_write_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.item_write_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBWriteCapacityUtilization"
    }

    target_value = 70.0
  }
}
