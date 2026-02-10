"""Translation service stub that exposes a TranslationService class.

This file provides a minimal `TranslationService` class so other modules can
import `TranslationService` reliably during local development. The
implementation is intentionally a no-op (returns text unchanged) to avoid
adding heavy translation dependencies. Replace with a real translator if
needed in production.
"""

from typing import Optional


class TranslationService:
    """Minimal translation service used by the FastAPI backend.

    Methods are intentionally lightweight and return the input text. They can
    be replaced with calls to an external translation API or library.
    """

    def __init__(self):
        pass

    def detect_geez_script(self, text: str) -> str:
        """Detect Ge'ez characters and return a language hint.

        Returns 'am' when Ge'ez characters are present, otherwise 'en'.
        """
        if any("\u1200" <= c <= "\u137F" for c in text):
            return "am"
        return "en"

    def translate(self, text: str, source_lang: str = "am", target_lang: str = "en") -> str:
        """Stub translator: returns text unchanged.

        Signature matches the expected simple API used elsewhere in the app.
        """
        return text

    def translate_to_english(self, text: str, src_lang: Optional[str] = None) -> str:
        return self.translate(text, source_lang=src_lang or "am", target_lang="en")

    def translate_from_english(self, text: str, target_lang: str) -> str:
        return self.translate(text, source_lang="en", target_lang=target_lang)

