const get = (url: string) => {
  const requestOptions = {
      method: 'GET'
  };
  return fetch(url, requestOptions).then(handleResponse);
}

const put = (url: string, body: Record<string, any>) => {
  const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
  };
  return fetch(url, requestOptions).then(handleResponse);
}

const handleResponse = (response: any) => {
  return response.text().then((text: any) => {
      const data = text && JSON.parse(text);

      if (!response.ok) {
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
      }

      return data;
  });
}

export const fetchWrapper = {
  get,
  put,
};
