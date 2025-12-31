import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

declare global {
  interface Window {
    __gtReady?: boolean;
    __applyTranslate?: (lang: string) => void;
  }
}

const languages = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
];

const DEFAULT_LANG = "fr"; // Default language is French

export default function LanguageSelector() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Get language from URL, default to French
  const currentLang = searchParams.get("lang") || DEFAULT_LANG;

  useEffect(() => {
    // If no lang param in URL, set default (French)
    if (!searchParams.get("lang")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("lang", DEFAULT_LANG);
      setSearchParams(newParams, { replace: true });
    }

    // Apply translation when language changes or on mount
    const applyTranslation = () => {
      const langToApply = searchParams.get("lang") || DEFAULT_LANG;
      if (window.__applyTranslate) {
        window.__applyTranslate(langToApply);
      } else {
        // Wait for Google Translate to be ready
        const checkAndApply = setInterval(() => {
          if (window.__applyTranslate) {
            window.__applyTranslate(langToApply);
            clearInterval(checkAndApply);
          }
        }, 100);

        // Timeout after 5 seconds
        setTimeout(() => clearInterval(checkAndApply), 5000);
      }
    };

    // Small delay to ensure Google Translate is initialized
    const timer = setTimeout(applyTranslation, 300);
    return () => clearTimeout(timer);
  }, [searchParams, setSearchParams]);

  const handleLanguageChange = (langCode: string) => {
    if (langCode === currentLang) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    // Update URL with new language
    const newParams = new URLSearchParams(searchParams);
    newParams.set("lang", langCode);
    setSearchParams(newParams, { replace: true });

    // Apply translation
    if (window.__applyTranslate) {
      window.__applyTranslate(langCode);
    } else {
      // Wait for Google Translate to be ready
      const checkAndApply = setInterval(() => {
        if (window.__applyTranslate) {
          window.__applyTranslate(langCode);
          clearInterval(checkAndApply);
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => clearInterval(checkAndApply), 5000);
    }
  };

  const currentLanguage = languages.find((lang) => lang.code === currentLang) || languages.find((lang) => lang.code === DEFAULT_LANG) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        aria-label="Select language"
      >
        {/* <span className="text-xl">{currentLanguage.flag}</span> */}
        <span className="text-sm font-medium text-gray-700">
          {currentLanguage.name}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                    currentLang === lang.code ? "bg-blue-50" : ""
                  }`}
                >
                  {/* <span className="text-xl">{lang.flag}</span> */}
                  <span className="text-sm font-medium text-gray-700">
                    {lang.name}
                  </span>
                  {currentLang === lang.code && (
                    <svg
                      className="w-4 h-4 text-blue-600 ml-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

