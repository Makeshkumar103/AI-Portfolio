"use client";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

function BackToTop() {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            {showButton && (
                <button
                    className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-md transition hover:bg-gray-100 hover:text-black dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                    onClick={scrollTop}
                >
                    <ArrowUp />
                </button>
            )}
        </>
    );
}

export default BackToTop;