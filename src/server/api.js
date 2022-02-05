import config from '../config';
import { get_access_token } from '../server/user_token';

const address =
    config.server.address + ':' + config.server.port + config.server.prefix;

export function API_post(method, data = {}) {
    const token = get_access_token() || '';
    return fetch(address + method, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
        .then((res) => res.json())
        .then(
            (result) => {
                if (result.response) {
                    return [null, result.response];
                } else if (result.errorData) {
                    return ['errorData', result.errorData];
                } else {
                    return ['error', result.error];
                }
            },
            (error) => {
                return ['error', error];
            },
        );
}

export function API_get(method) {
    const token = get_access_token() || '';
    return fetch(address + method, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
        .then((res) => res.json())
        .then(
            (result) => {
                if (result.response) {
                    return [null, result.response];
                } else {
                    return ['error', result.error];
                }
            },
            (error) => {
                return ['error', error];
            },
        );
}
