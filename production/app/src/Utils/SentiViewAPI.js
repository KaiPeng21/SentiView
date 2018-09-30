
import fetchJsonp from 'fetch-jsonp';

export const API_ENDPOINT = 'https://lbpqy5ek0d.execute-api.us-east-1.amazonaws.com/prod';

// simple and general fetch data api function (* is the default)
const requestData = (requestType=`GET`, url=``, data = {}) => {
    return fetch(url, {
        method: requestType,              // *GET, POST, PUT, DELETE, etc.
        mode: 'cors',                     // no-cors, cors, *same-origin
        cache: 'no-cache',                // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin',       // include, same-origin, *omit
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        redirect: 'follow',               // manual, *follow, error
        referrer: 'no-referrer',          // no-referrer, *client
        body: JSON.stringify(data), 
    })
    .then(response => response.json())    // parses response to JSON
    .catch(error => console.error(`Fetch Error =\n`, error));
};

// sent a GET request to the serverless backend
export async function getSentiviewPromise(search) {
    let response = await fetch(`${API_ENDPOINT}?search=${search}`)
    let data = await response.json()
    return data
}

// send a POST request to the serverless backend
export async function postSentiviewPromise(search) {
    const data = {
        "entities" : [
            {
                "search" : [search]
            }
        ]
    }
    return await requestData('POST', API_ENDPOINT, data)
}

