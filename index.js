import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const REPOSITORIES_GITHUB = JSON.parse(process.env.REPOSITORIES_GITHUB);
const TOKEN_GITHUB = process.env.TOKEN_GITHUB; // GitHub Personal Access Token
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL; // Slack Webhook URL
const REVIEWER_USERNAME = process.env.REVIEWER_USERNAME; // GitHub Username

async function notifyPendingPullRequests() {
  let allPendingReviews = [];

  for (const repo of REPOSITORIES_GITHUB) {
    const pullRequests = await getOpenPullRequests(repo.owner, repo.repo);
    const pendingReviews = pullRequests.filter(pr => isReviewerAndNotApproved(pr));
    allPendingReviews = allPendingReviews.concat(pendingReviews);
  }

  if (allPendingReviews.length > 0) {
    const message = formatSlackMessage(allPendingReviews);
    sendSlackNotification(message);
  } else {
    console.log('No pending pull requests found');
  }
}

async function getOpenPullRequests(owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls`;
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `token ${TOKEN_GITHUB}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  };

  const response = await fetch(url, options);
  const pullRequests = await response.json();

  return pullRequests;
}

function isReviewerAndNotApproved(pullRequest) {
  return pullRequest.requested_reviewers.some(reviewer => reviewer.login === REVIEWER_USERNAME);
}

function formatSlackMessage(pullRequests) {
  let message = `以下のプルリクエストが${REVIEWER_USERNAME}の承認待ちです:\n`;

  pullRequests.forEach(pr => {
    message += `<${pr.html_url}|${pr.title}>\n`;
  });

  return message;
}

function sendSlackNotification(message) {
  const payload = {
    text: message
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  };

  fetch(SLACK_WEBHOOK_URL, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error sending message to Slack: ${response.statusText}`);
      }
      return response.text();
    })
    .then(text => console.log('Slack notification sent:', text))
    .catch(error => console.error('Error:', error));
}

// 実行
notifyPendingPullRequests();

