export const handleResponse = (response) => {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return response.json().then(json => {
            return Promise.reject(Object.assign({}, json || response.message || response.statusText));
        });
    }
};
