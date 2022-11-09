require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

let userToken = null;

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});

app.get('/auth', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`,
  );
});

app.get('/oauth-callback', ({ query: { code } }, res) => {
  fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_SECRET,
      code,
    })
  })
  .then(res => res.json())
  .then(res => res.access_token)
  .then(token => {
    userToken = token;
    res.redirect('/?token=true');
  })
  .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/create', ({ query: { description, file, content } }, res) => {
  let files = {};
  files[file] = { content }

  fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken
    },
    body: JSON.stringify({
      description,
      public: false,
      files
    })
  })
  .then(result => result.json())
  .then(result => {
    res.redirect('/?gist=' + result.html_url);
  });
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
