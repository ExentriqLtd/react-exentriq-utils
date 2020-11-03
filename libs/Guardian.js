import { EXENTRIQ_URL_HOST } from './config';

const Guardian = new (class {
  async fetch(url, options, raw = false) {
    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then(async (response) => {
          if (!response.ok) {
            const error = new Error(response.statusText);
            error.response = response;
            reject(error);
          } else {
            if (raw) {
              response.text().then(resolve);
              return;
            }
            const body = JSON.parse(await response.text());
            const { result } = body;
            if (result) {
              const { list } = result;
              if (list) {
                resolve(list.list || list);
                return;
              }
              resolve(result);
              return;
            }
            resolve(body);
          }
        })
        .catch((error) => reject(error));
    });
  }

  async call(method, params, sessionToken = null, raw = false) {
    let url = EXENTRIQ_URL_HOST;
    const timestamp = new Date().getTime();
    if (sessionToken) {
      url += `?sid=${sessionToken}&timestamp=${timestamp}`;
    } else {
      url += `?timestamp=${timestamp}`;
    }
    const options = {
      method: 'POST',
      body: JSON.stringify({ id: '', method, params }),
    };
    return this.fetch(url, options, raw);
  }
})();

export default Guardian;
