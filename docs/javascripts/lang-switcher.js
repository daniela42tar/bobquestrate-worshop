/* ==========================================================================
   Bobchestrate Workshop — Language Switcher
   Supported languages: es (default), en, ca

   Strategy:
   - Spanish content lives at the root paths  (e.g. /introduction/)
   - English content lives under /en/         (e.g. /en/introduction/)
   - Catalan content lives under /ca/         (e.g. /ca/introduction/)

   On language switch the user is navigated to the equivalent page in the
   chosen language. The choice is persisted in localStorage so subsequent
   page loads land in the right language.
   ========================================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "bw-language";
  var DEFAULT_LANG = "es";
  var SUPPORTED = ["es", "en", "ca"];

  /* ------------------------------------------------------------------
     URL helpers
  ------------------------------------------------------------------ */

  /**
   * Return the base path of the site (everything before the first
   * language-prefixed segment or root page).
   * Works with or without a trailing slash, with or without a base URL.
   */
  function getSiteBase() {
    // The MkDocs site_url / base href is set on <base> in the page <head>.
    var base = document.querySelector("base");
    if (base && base.href) {
      return base.href.replace(/\/$/, "");
    }
    return window.location.origin;
  }

  /**
   * Parse the current page path and return an object:
   *   { lang: "es"|"en"|"ca", page: "/introduction/" }
   * where `page` is the language-stripped path relative to the site root
   * (always starts and ends with /).
   */
  function parsePath() {
    var base = getSiteBase();
    var fullPath = window.location.pathname;

    // Strip the base path prefix so we work with the relative path
    var rel = fullPath;
    if (base && fullPath.startsWith(new URL(base).pathname)) {
      rel = fullPath.slice(new URL(base).pathname.replace(/\/$/, "").length);
    }
    // Ensure leading slash
    if (!rel.startsWith("/")) rel = "/" + rel;

    // Detect language prefix
    for (var i = 0; i < SUPPORTED.length; i++) {
      var lang = SUPPORTED[i];
      if (lang === DEFAULT_LANG) continue; // "es" = no prefix
      var prefix = "/" + lang + "/";
      if (rel === "/" + lang || rel === "/" + lang + "/") {
        return { lang: lang, page: "/" };
      }
      if (rel.startsWith(prefix)) {
        return { lang: lang, page: rel.slice(prefix.length - 1) };
      }
    }

    // No prefix → Spanish (default)
    return { lang: DEFAULT_LANG, page: rel };
  }

  /**
   * Build the URL for a given language and canonical page path.
   */
  function buildUrl(lang, page) {
    var base = getSiteBase();
    // Normalise page: ensure leading slash, keep trailing slash
    if (!page.startsWith("/")) page = "/" + page;

    var prefix = lang === DEFAULT_LANG ? "" : "/" + lang;
    return base + prefix + page;
  }

  /* ------------------------------------------------------------------
     Active-button state
  ------------------------------------------------------------------ */
  function setActiveButton(lang) {
    document.querySelectorAll(".bw-lang-btn").forEach(function (btn) {
      btn.classList.toggle("bw-lang-active", btn.dataset.lang === lang);
    });
  }

  /* ------------------------------------------------------------------
     Navigate to the equivalent page in the chosen language.
     If we're already on the target language, do nothing.
  ------------------------------------------------------------------ */
  function switchLang(targetLang) {
    var current = parsePath();

    // Persist immediately so the next page load uses the new language
    try {
      localStorage.setItem(STORAGE_KEY, targetLang);
    } catch (e) {}

    if (current.lang === targetLang) {
      setActiveButton(targetLang);
      return;
    }

    var targetUrl = buildUrl(targetLang, current.page);
    window.location.href = targetUrl;
  }

  /* ------------------------------------------------------------------
     On page load: redirect to the stored language if necessary.
     This ensures that navigating via the sidebar keeps the language.
  ------------------------------------------------------------------ */
  function redirectIfNeeded() {
    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}
    var preferred = stored && SUPPORTED.indexOf(stored) !== -1 ? stored : DEFAULT_LANG;

    var current = parsePath();

    // Already on the right language — just update button state
    if (current.lang === preferred) {
      setActiveButton(preferred);
      return;
    }

    // Redirect silently
    var targetUrl = buildUrl(preferred, current.page);
    window.location.replace(targetUrl);
  }

  /* ------------------------------------------------------------------
     Initialise
  ------------------------------------------------------------------ */
  function init() {
    // Wire up buttons
    document.querySelectorAll(".bw-lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        switchLang(btn.dataset.lang);
      });
    });

    // Set correct active button without redirecting (redirect already done above)
    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}
    var current = parsePath();
    setActiveButton(current.lang);

    // Also update <html lang> for accessibility
    document.documentElement.setAttribute("lang", current.lang);
  }

  /* ------------------------------------------------------------------
     Entry point: redirect first, then init UI
  ------------------------------------------------------------------ */
  if (document.readyState === "loading") {
    // Run redirect before DOMContentLoaded to avoid a flash
    redirectIfNeeded();
    document.addEventListener("DOMContentLoaded", init);
  } else {
    redirectIfNeeded();
    init();
  }
})();
