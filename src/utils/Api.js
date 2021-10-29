export class Api {
  _baseUrl;
  _headers;

  constructor({baseUrl, headers}) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getUserInfo() {
    return this._request('GET', '/users/me');
  }

  getInitialCards() {
    return this._request('GET', '/cards');
  }

  setUserInfo({name, about}) {
    return this._request('PATCH', '/users/me', {
      name: name,
      about: about
    });
  }

  addCard({name, link}) {
    return this._request('POST', '/cards', {
      name: name,
      link: link
    });
  }

  deleteCard(cardId) {
    return this._request('DELETE', `/cards/${cardId}`);
  }

  changeLikeCardStatus(like, cardId) {
    const method = like ? 'PUT' : 'DELETE';
    return this._request(method, `/cards/likes/${cardId}`);
  }


  updateProfileImage(imageLink) {
    return this._request('PATCH', '/users/me/avatar', {
      avatar: imageLink
    });
  }

  _request(method, path, body) {
    const init = {};
    init.method = method;
    init.headers = this._headers;
    if (body)
      init.body = JSON.stringify(body);
    return fetch(this._baseUrl + path, init)
      .then(res => res.ok ? res.json() : Promise.reject(`Request error: ${res.status}`));
  }

}

export const yandexApi = new Api({
  baseUrl: process.env.REACT_APP_API_URL,
  headers: {
    authorization: process.env.REACT_APP_API_KEY,
    'Content-Type': 'application/json'
  }
});