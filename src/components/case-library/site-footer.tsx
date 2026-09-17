import { useTranslation } from "react-i18next";

export const SiteFooter = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border/70 bg-background">
      <div className="container py-10">
        <a
          href="https://enter.converge.ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          {t("footer.builtWith")}
        </a>
      </div>
    </footer>
  );
};
