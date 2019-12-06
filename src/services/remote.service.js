const API_URL = 'http://localhost:3004/api/v1';

export class RemoteService {

    request(requestType, urlOptions) {
        // Get JsonWebToken
        let token = sessionStorage.getItem('token');

        // HEADER
        // Set request header
        // ===========================
        var _headers = new Headers();
        _headers.append('Content-Type', 'application/json');
        _headers.append('Accept', 'application/json');
        if (token && token !== null) {
            _headers.append('token', `${token}`);
        }

        if (urlOptions.requireAuthentication) {
            _headers.append('Authorization', `Bearer ${token}`);
        }
        let fetchObj = {};
        if (urlOptions.body) {
            fetchObj['body'] = urlOptions.body ? JSON.stringify(urlOptions.body) : null;
        }
        // FETCH
        // ===========================
        return fetch(`${API_URL}/${urlOptions.endPoint}${urlOptions.restOfUrl}`, {
            method: requestType || 'GET',   // *GET, POST, PUT, DELETE, etc.
            ...fetchObj,
            // body: urlOptions.body ? JSON.stringify(urlOptions.body) : {},
            // credentials: 'include',
            // credentials: 'same-origin',  // include, *same-origin, omit
            cache: 'no-cache',              // *default, no-cache, reload, force-cache, only-if-cached
            mode: 'cors',                   // no-cors, *cors, same-origin
            redirect: 'follow',             // manual, *follow, error
            referrer: 'no-referrer',        // no-referrer, *client
            headers: _headers
        })
            .then((response) => {
                // If error then exit
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    sessionStorage.removeItem('token');
                    return;
                }

                // Examine the text in the response
                // console.log('Response : ', response);
                return response.json();
            }).catch((error) => {
                // This is where you run code if the server returns any errors
                console.log('Looks like there was a problem in service. ' + error);
            });;
    }

}
