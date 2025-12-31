/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

declare global {
  interface Window {
    __gtReady?: boolean;
    __applyTranslate?: (lang: string) => void;
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

const DEFAULT_LANG = "fr"; // Default language is French

export default function GoogleTranslate() {
  // Patch DOM methods to handle NotFoundError from Google Translate conflicts
  useEffect(() => {
    const origRemove = Node.prototype.removeChild;
    const origAppend = Node.prototype.appendChild;
    const origInsert = Node.prototype.insertBefore;

    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      try {
        return origRemove.call(this, child) as T;
      } catch (e: any) {
        if (e.name === "NotFoundError") return child;
        throw e;
      }
    };

    Node.prototype.appendChild = function <T extends Node>(child: T): T {
      try {
        return origAppend.call(this, child) as T;
      } catch (e: any) {
        if (e.name === "NotFoundError") return child;
        throw e;
      }
    };

    Node.prototype.insertBefore = function <T extends Node>(
      newNode: T,
      ref: Node | null
    ): T {
      try {
        return origInsert.call(this, newNode, ref) as T;
      } catch (e: any) {
        if (e.name === "NotFoundError") return newNode;
        throw e;
      }
    };

    // No cleanup needed — safe to leave patched
  }, []);

  // Hide all Google Translate UI elements immediately
  useEffect(() => {
    const hideTranslateElements = () => {
      const selectors = [
        '.goog-te-banner-frame',
        '.goog-te-balloon-frame',
        '.goog-te-gadget',
        '.goog-te-gadget-simple',
        '.goog-te-gadget-icon',
        '.skiptranslate',
        'iframe[title*="translate"]',
        'iframe[title*="Google"]',
        '.goog-te-menu-frame',
        '#google_translate_element > div',
        '#google_translate_element > span',
      ];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el: Element) => {
          (el as HTMLElement).style.display = 'none';
          (el as HTMLElement).style.visibility = 'hidden';
          (el as HTMLElement).style.opacity = '0';
          (el as HTMLElement).style.height = '0';
          (el as HTMLElement).style.width = '0';
          (el as HTMLElement).style.overflow = 'hidden';
        });
      });
    };

    // Run immediately and continuously
    hideTranslateElements();
    const interval = setInterval(hideTranslateElements, 100);
    
    return () => clearInterval(interval);
  }, []);

  // Initialize Google Translate
  useEffect(() => {
    // Create container if needed
    let container = document.getElementById("google-translate-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "google-translate-container";
      container.style.display = 'none';
      container.style.visibility = 'hidden';
      document.body.insertBefore(container, document.body.firstChild);
    }

    // Skip if script already loaded
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      try {
        if (!window.google?.translate?.TranslateElement) return;
        const target = document.getElementById("google_translate_element");
        if (!target) return;
        target.innerHTML = "";
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,fr",
            autoDisplay: false,
          },
          "google_translate_element"
        );
        window.__gtReady = true;
        console.log("Google Translate initialized");
      } catch (error) {
        console.debug("[Google Translate] Initialization error", error);
      }
    };

    // Define the apply function
    window.__applyTranslate = (targetLang: string) => {
      if (!window.__gtReady) {
        console.warn("Google Translate not ready yet");
        return;
      }

      // Set cookie
      const expires = new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toUTCString();
      document.cookie = `googtrans=/en/${targetLang}; expires=${expires}; path=/; SameSite=Lax`;

      // Find and trigger the select
      const tryChange = () => {
        const combo = document.querySelector(
          ".goog-te-combo"
        ) as HTMLSelectElement | null;
        if (combo && combo.value !== targetLang) {
          combo.value = targetLang;
          combo.dispatchEvent(new Event("change", { bubbles: true }));
          return true;
        }
        return false;
      };

      if (!tryChange()) {
        let attempts = 0;
        const interval = setInterval(() => {
          if (tryChange() || attempts > 30) {
            clearInterval(interval);
          }
          attempts++;
        }, 200);
      }
    };

    // Apply default language from URL on mount
    const applyLanguageFromURL = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const langFromURL = urlParams.get("lang") || DEFAULT_LANG;
      
      // If URL doesn't have lang param, add it
      if (!urlParams.get("lang")) {
        urlParams.set("lang", DEFAULT_LANG);
        const newURL = `${window.location.pathname}?${urlParams.toString()}${window.location.hash}`;
        window.history.replaceState({}, "", newURL);
      }

      // Apply translation after Google Translate is ready
      const applyWhenReady = () => {
        if (window.__gtReady && window.__applyTranslate) {
          window.__applyTranslate(langFromURL);
        } else {
          setTimeout(applyWhenReady, 100);
        }
      };
      
      // Start checking after a short delay to ensure script is loaded
      setTimeout(applyWhenReady, 500);
    };

    // Load the script
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    
    // Apply language from URL after script loads
    script.onload = () => {
      setTimeout(applyLanguageFromURL, 1000);
    };
    
    document.body.appendChild(script);
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{ 
        display: "none",
        visibility: "hidden",
        opacity: 0,
        height: 0,
        width: 0,
        overflow: "hidden",
        position: "absolute",
        left: "-9999px"
      }}
      className="notranslate"
    />
  );
}

