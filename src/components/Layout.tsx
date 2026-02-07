import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ArrowLeft } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    actionButton?: React.ReactNode;
    onBack?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, actionButton, onBack }) => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const langs = ['en', 'he', 'ru', 'ar'];
        // Robust match (e.g., 'en-US' -> 'en')
        const currentLangBase = i18n.language?.split('-')[0] || 'en';
        const currentIndex = langs.indexOf(currentLangBase);
        // If not found (e.g. unknown lang), default to switching to English (0)
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % langs.length;
        const nextLang = langs[nextIndex];
        i18n.changeLanguage(nextLang);
    };

    useEffect(() => {
        document.documentElement.dir = i18n.language === 'he' || i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    return (
        <div className="min-h-screen bg-banking-bg flex justify-center font-sans text-gray-900">
            <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100/50 pt-safe-top transition-all">
                    <div className="h-14 flex items-center justify-between px-4">
                        <div className="flex items-center gap-3">
                            {onBack && (
                                <button
                                    onClick={onBack}
                                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors active:scale-90"
                                    aria-label="Go Back"
                                >
                                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                                </button>
                            )}
                            <h1 className="text-lg font-bold text-gray-900 truncate tracking-tight">
                                {title || "Money Bridge"}
                            </h1>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={toggleLanguage}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors active:scale-95"
                                aria-label="Switch Language"
                            >
                                <Globe className="w-5 h-5 text-banking-blue" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className={twMerge(
                    "flex-1 overflow-y-auto overflow-x-hidden p-5 pb-36 scrollbar-hide", // Increased padding and bottom space
                    "space-y-6"
                )}>
                    {children}
                </main>

                {/* Sticky Action Footer */}
                {actionButton && (
                    <div className="fixed bottom-0 w-full max-w-md z-50 pointer-events-none">
                        {/* Gradient Fade for Safe Area */}
                        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-white via-white/95 to-transparent" />

                        <div className="absolute bottom- safe-pb w-full px-5 pb-8 pointer-events-auto">
                            {actionButton}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
