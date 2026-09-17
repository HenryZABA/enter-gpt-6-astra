import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

export const HeroStage = () => {
  const { t } = useTranslation();

  return (
    <section className="ambient-section relative isolate overflow-hidden border-b border-border/60">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <img
          src="https://cdn.enter.pro/resources/uid_100006299/hero-abstract-prism_8e08ef1a.png"
          crossOrigin="anonymous"
          alt=""
          className="h-full w-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background)/0.48)_0%,hsl(var(--background)/0.18)_48%,hsl(var(--background)/0.78)_100%)]" />
      </div>

      <div className="container flex min-h-[320px] items-center justify-center py-10 sm:py-12 lg:py-14">
        <div className="relative mx-auto max-w-5xl text-center animate-fade-in">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
            {t("hero.eyebrow")}
          </p>

          <h1 className="mx-auto mt-4 max-w-4xl font-display text-3xl font-semibold uppercase leading-[1.02] tracking-[-0.05em] text-foreground sm:text-4xl lg:text-[3.15rem]">
            {t("hero.titleLine1")}
            <span className="mt-1 block text-foreground/75">
              {t("hero.titleLine2")}
            </span>
          </h1>

          <Button asChild className="mt-6 rounded-lg px-7">
            <a
              href="https://enter.converge.ai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("hero.buildInEnter")}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
