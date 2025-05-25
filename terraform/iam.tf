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
        "Resource" : ["arn:aws:dynamodb:eu-north-1:911197153746:table/user", "arn:aws:dynamodb:eu-north-1:911197153746:table/user_league_data", "arn:aws:dynamodb:eu-north-1:911197153746:table/items"]
      },
      {
        "Sid" : "S3Access",
        "Effect" : "Allow",
        "Action" : [
          "s3:PutObject",
          "s3:DeleteObject"
        ],
        "Resource" : "arn:aws:s3:::user-item-filters"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.item_manager.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
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
