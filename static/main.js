const URL_PARAMS = new URLSearchParams(window.location.search);
const TOKEN = URL_PARAMS.get('token');
const GIST = URL_PARAMS.get('gist');

const show = selector => {
  document.querySelector(selector).style.display = 'block';
};

const hide = selector => {
  document.querySelector(selector).style.display = 'none';
};

if (TOKEN) {
  hide('.content.unauthorized');
  show('.content.authorized');
}

if (GIST) {
  hide('.content.unauthorized');
  hide('.content.authorized');
  show('.content.gist');
  document.getElementById('gist-url').href = GIST;
}
