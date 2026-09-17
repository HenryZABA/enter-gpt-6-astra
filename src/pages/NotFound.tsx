import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 font-display text-4xl font-medium text-foreground">
          404
        </h1>
        <p className="mb-4 text-xl text-muted-foreground">
          {t("notFound.title")}
        </p>
        <a
          href="/"
          className="inline-flex h-11 items-center text-primary underline-offset-4 hover:underline"
        >
          {t("notFound.actions.backHome")}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
