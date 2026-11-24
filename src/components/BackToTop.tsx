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
                    className="fixed bottom-5 right-3.5 sm:bottom-6 sm:right-8 z-40 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-gray-300/80 bg-white/90 backdrop-blur text-gray-700 shadow-lg transition hover:bg-gray-100 hover:text-black dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                    onClick={scrollTop}
                    aria-label="Back to top"
                >
                    <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            )}
        </>
    );
}

export default BackToTop;