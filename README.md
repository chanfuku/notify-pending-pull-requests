# notify-pending-pull-requests

## What is this?

自分がreviewerになっている & approveしていないpull requestsを毎日9時AMにslackに通知してくれます。

下記項目をGitHub ActionsのSecretsに設定します。

```
# JSON formatで複数のリポジトリを指定できます
REPOSITORIES_GITHUB=[{"owner": "sample-owner", "repo": "sample-repo"}]
# ご自身のGitHub Personal access token
TOKEN_GITHUB=
# Slack通知先チャンネルのwebhook url
SLACK_WEBHOOK_URL=
# 自分のGitHub username
REVIEWER_USERNAME=
```
