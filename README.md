

# notify-pending-pull-requests

## これは何?

下記をGitHub ActionsのSecretsに設定すると、

自分がreviewerになっている & approveしていないpull requestsを毎日９時AMにslackに通知してくれます。

```bash
# JSON formatで複数のリポジトリを指定できます
REPOSITORIES_GITHUB=[{"owner": "sample-owner", "repo": "sample-repo"}]

# ご自身のGitHub Personal access token
TOKEN_GITHUB=xxxyyyyzzz

# Slack通知先チャンネルのwebhook url
SLACK_WEBHOOK_URL=xxx.com

# 自分のGitHub username
REVIEWER_USERNAME=your_user_name
```

## localで動かすには

```bash
npm install
cp .env.example .env
```

.envを適宜修正し、

```bash
node index.js
```
