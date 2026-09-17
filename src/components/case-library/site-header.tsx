import { useTranslation } from "react-i18next";

import { LanguageSwitcher } from "@/components/language-switcher";
import { campaign } from "@/data/cases";

export const SiteHeader = () => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="https://cdn.enter.pro/visual_resources/100006299/b33ba3b0576e41ecb37b2d0a7e7609e5/a8f2c049.png"
            alt="Enter Pro"
            className="h-5 w-auto max-w-[100px] shrink-0 object-contain"
          />
          <span aria-hidden="true" className="hidden h-4 w-px bg-border sm:block" />
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:inline-block">
            {campaign.label}
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <span className="hidden h-11 items-center whitespace-nowrap px-3 text-xs font-medium text-muted-foreground sm:inline-flex">
            {t("header.language")}
          </span>
          <LanguageSwitcher className="prism-button prism-button-soft h-9 min-w-[176px] border-foreground/15 bg-foreground/[0.055] text-xs shadow-[inset_0_1px_0_hsl(var(--foreground)/0.1),0_8px_24px_hsl(var(--background)/0.28)] backdrop-blur-xl" />
        </div>
      </div>
    </header>
  );
};
