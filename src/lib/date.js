const months_short = {
    en: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ],
    ru: [
        'Янв',
        'Фев',
        'Мар',
        'Апр',
        'Май',
        'Июн',
        'Июл',
        'Авг',
        'Сен',
        'Окт',
        'Ноя',
        'Дек',
    ],
};

function isInToday(timestamp) {
    let today = new Date().setHours(0, 0, 0, 0);
    let thatDay = new Date(timestamp).setHours(0, 0, 0, 0);

    if (today === thatDay) {
        return true;
    }
}

function isInYesterday(timestamp) {
    let today = new Date();
    let thatDay = new Date(timestamp);
    today.setDate(today.getDate() - 1);
    if (today.toDateString() === thatDay.toDateString()) {
        return true;
    }
}

function isThisYear(timestamp) {
    let today = new Date();
    let thatDay = new Date(timestamp);
    if (today.getFullYear() === thatDay.getFullYear()) {
        return true;
    }
}

export function dater(timestamp, lang) {
    isThisYear(timestamp);
    let a = new Date(timestamp);
    if (isInToday(timestamp)) {
        return (
            a.getHours() +
            ':' +
            (a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes())
        );
    } else if (isInYesterday(timestamp)) {
        return lang === 'en'
            ? 'Yesterday ' + a.getHours() + ':' + a.getMinutes()
            : 'Вчера ' +
                  a.getHours() +
                  ':' +
                  (a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes());
    } else if (isThisYear(timestamp)) {
        return a.getDate() + ' ' + months_short[lang][a.getMonth()];
    } else {
        return (
            a.getDate() +
            ' ' +
            months_short[lang][a.getMonth()] +
            ' ' +
            a.getFullYear()
        );
    }
}
