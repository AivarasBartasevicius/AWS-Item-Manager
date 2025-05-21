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

resource "aws_iam_role_policy" "item_manager_policy" {
  name = "item-manager"
  role = aws_iam_role.item_manager.name

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "DynamoDBAccess",
        "Effect" : "Allow",
        "Action" : [
          "dynamodb:DeleteItem",
          "dynamodb:UpdateItem",
          "dynamodb:PutItem",
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:GetItem"
        ],
        "Resource" : "arn:aws:dynamodb:eu-north-1:911197153746:table/item_metadata"
      },
      {
        "Sid" : "S3Access",
        "Effect" : "Allow",
        "Action" : [
          "s3:PutObject",
          "s3:DeleteObject"
        ],
        "Resource" : "arn:aws:s3:::your-bucket-name/*"
      }
    ]
  })
}

resource "aws_iam_policy" "github_actions_policy" {
  name        = "github-actions-policy"
  description = "ECR access policy for lambda repositories"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "GetAuthorizationToken",
        Effect = "Allow",
        Action = [
          "ecr:GetAuthorizationToken"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:CompleteLayerUpload",
          "ecr:GetDownloadUrlForLayer",
          "ecr:InitiateLayerUpload",
          "ecr:PutImage",
          "ecr:UploadLayerPart"
        ],
        Resource = [
          "arn:aws:ecr:*:424432388155:repository/*"
        ]
      }
    ]
  })
}

resource "aws_iam_group" "ecr_group" {
  name = "ecr-access-group"
}

resource "aws_iam_user" "github_actions" {
  name = "github-actions"
}

resource "aws_iam_user_group_membership" "ecr_user_group" {
  user = aws_iam_user.github_actions.name
  groups = [
    aws_iam_group.ecr_group.name
  ]
}

resource "aws_iam_group_policy_attachment" "ecr_group_attach" {
  group      = aws_iam_group.ecr_group.name
  policy_arn = aws_iam_policy.github_actions_policy.arn
}

resource "aws_iam_access_key" "ecr_user_key" {
  user = aws_iam_user.github_actions.name
}
