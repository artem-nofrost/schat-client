import { useState, useEffect, useCallback } from 'react';

// Проверка на фокус страницы
const useFocusedPage = () => {
    const [pageFocused, setPageFocused] = useState(document.hasFocus());

    const onFocus = useCallback(() => {
        setPageFocused(true);
    }, []);

    const onBlur = useCallback(() => {
        setPageFocused(false);
    }, []);

    useEffect(() => {
        window.addEventListener('focus', onFocus);
        window.addEventListener('blur', onBlur);
        return () => {
            window.removeEventListener('focus', onFocus);
            window.removeEventListener('blur', onBlur);
        };
    }, [onBlur, onFocus]);

    return pageFocused;
};

export default useFocusedPage;
