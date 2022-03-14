import { useState, useEffect, useCallback } from 'react';

// Проверка на наличие скролла, его положения
const useElementScroll = (element) => {
    const [bottom, setBottom] = useState(true);
    const [top, setTop] = useState(false);
    const [exist, setExist] = useState(false);

    const scrollToBottom = useCallback(() => {
        if (element) {
            element.scroll({
                top: element.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [element]);

    useEffect(() => {
        if (element) {
            function handleScroll() {
                const isExist = element.scrollHeight > element.clientHeight;
                setExist(isExist);
                if (isExist) {
                    const isBottom =
                        element.scrollHeight - Math.ceil(element.scrollTop) <=
                        element.clientHeight;
                    setBottom(isBottom);
                    const isTop = element.scrollTop <= 0;
                    setTop(isTop);
                }
            }
            element.addEventListener('scroll', handleScroll);
            return () => {
                element.removeEventListener('scroll', handleScroll);
            };
        }
    }, [element]);

    return { scrollToBottom, bottom, top, exist };
};

export default useElementScroll;
