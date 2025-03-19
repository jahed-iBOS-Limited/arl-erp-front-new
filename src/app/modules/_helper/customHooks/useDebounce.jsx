import { useState } from "react";

export default function useDebounce() {
    const [typingTimeout, setTypingTimeout] = useState(null);

    function debounce(func, wait = 500) {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        const timer = setTimeout(() => {
            func();
        }, wait);

        setTypingTimeout(timer);
    }

    return debounce;
}