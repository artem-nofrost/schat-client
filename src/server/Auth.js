import { API_post } from '../server/api';

// обновление токена
export async function update_tokens() {
    const userData = await API_post('/user/confirm');
    return userData;
}

// проверяем пользователя на авторизированность
export async function signIn() {
    let status, data;
    // запрос на обновление обоих токенов
    [status, data] = await update_tokens();

    if (status === 'errorData' || status === 'error') {
        return [null, false];
    } else {
        localStorage.access_token = data.access_token;
        return [data, true];
    }
}
