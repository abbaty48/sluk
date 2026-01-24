import { useEffect, useState, type RefObject } from "react";

export default function useIntersection(ref: RefObject<HTMLElement | null>) {
    const [isIntersected, setIsIntersected] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                setIsIntersected(entries[0].isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (ref?.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [ref]);

    return isIntersected
}
