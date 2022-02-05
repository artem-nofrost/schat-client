import React, { useCallback } from 'react';

function Lang() {
    const localLang =
        localStorage.getItem('lang') === 'en'
            ? localStorage.getItem('lang')
            : 'ru';

    const toggleLang = useCallback((e) => {
        const language = e.target.getAttribute('data-lang');
        localStorage.setItem('lang', language);
        window.location.reload();
    }, []);

    return (
        <div className="d-flex ml-auto lang logos-nav">
            <div className="dropdown-lang">
                <div
                    className={
                        localLang === 'en'
                            ? 'dropbtn dropen m-2'
                            : 'dropbtn m-2'
                    }
                >
                    {localLang === 'en' ? 'EN' : 'RU'}
                </div>
                <div className="dropdown-content">
                    <div className="dropdown-content2">
                        <div className="first-lang p-2">
                            <span onClick={toggleLang} data-lang="ru">
                                RU
                            </span>
                        </div>
                        <div className="last-lang p-2">
                            <span onClick={toggleLang} data-lang="en">
                                EN
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Lang;
