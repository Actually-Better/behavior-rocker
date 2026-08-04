import { GlobeSimple, SlidersHorizontal } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { LANGUAGES, useI18n } from "../i18n.jsx";

export function BrandHeader({ onCustomize }) {
  const { locale, setLocale, t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const languageRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeMenu = (event) => {
      if (event.key === "Escape" || (event.type === "pointerdown" && !languageRef.current?.contains(event.target))) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", closeMenu);
    document.addEventListener("pointerdown", closeMenu);
    return () => {
      document.removeEventListener("keydown", closeMenu);
      document.removeEventListener("pointerdown", closeMenu);
    };
  }, [menuOpen]);

  return (
    <header className="brand-header">
      <a className="brand-mark" href="https://actually-better.com/" rel="noopener" aria-label="Actually Better">
        <img src="/actually-better-symbol-approved.png" width="54" height="54" alt="" />
      </a>
      <div className="brand-product">
        <span className="brand-product-name">Behavior Rocker</span>
        <span className="brand-endorsement">an Actually Better product</span>
      </div>
      <nav className="utility-nav" aria-label={t("properties")}>
        <button className="gear" type="button" onClick={onCustomize} aria-label={t("customize")} title={t("customize")}>
          <SlidersHorizontal aria-hidden="true" size={21} />
        </button>
        <div className={`lang${menuOpen ? " open" : ""}`} ref={languageRef}>
          <button className="lang-icon" type="button" aria-label={t("language")} aria-haspopup="menu" aria-expanded={menuOpen} title={t("language")} onClick={() => setMenuOpen((open) => !open)}>
            <GlobeSimple aria-hidden="true" size={20} />
          </button>
          <div className="lang-menu" role="menu" hidden={!menuOpen}>
            {LANGUAGES.map((language) => (
              <button type="button" role="menuitem" aria-current={locale === language.code ? "true" : undefined} onClick={() => { setLocale(language.code); setMenuOpen(false); }} key={language.code}>
                {language.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
