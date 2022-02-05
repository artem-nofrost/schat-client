import React from 'react'; // пакет
import { BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom'; // пакет
import App from './App'; // APP.js из src
import './App.scss'; // стандартный SCSS файл
import './dark.scss'; // стандартный SCSS файл
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'; // CSS Бутстрапа
import * as serviceWorker from './serviceWorker';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const I18nApp = () => {
    return (
        <I18nextProvider i18n={i18n}>
            <App />
        </I18nextProvider>
    );
};

i18n.init().then(() =>
    ReactDOM.render(
        <Router>
            <I18nApp />
        </Router>,
        document.getElementById('site-wrap'),
    ),
);

serviceWorker.unregister();
