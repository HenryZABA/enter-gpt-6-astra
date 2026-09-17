import { ArrowUpRight, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { LiveFrame } from "@/components/case-library/live-frame";
import { PromptPanel } from "@/components/case-library/prompt-panel";
import { Button } from "@/components/ui/button";
import { CaseFlipTransition } from "@/components/case-library/case-flip-transition";
import type { CaseFlipOrigin } from "@/hooks/use-case-flip";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CaseEntry } from "@/data/cases";
import { pickCaseDescription, pickCaseTitle } from "@/hooks/use-case-filters";
import { useCurrentLanguage } from "@/hooks/use-current-language";

type CaseDetailDialogProps = {
  entry: CaseEntry;
  origin: CaseFlipOrigin;
  onClosed: () => void;
};

/** Detail content on the expanded reverse face of the originating card. */
export const CaseDetailDialog = ({
  entry,
  origin,
  onClosed,
}: CaseDetailDialogProps) => {
  const { t } = useTranslation();
  const language = useCurrentLanguage();

  if (!entry) return null;

  const title = pickCaseTitle(entry, language);
  const description = pickCaseDescription(entry, language);

  const categoryLabel =
    entry.category === "interactive3d"
      ? t("category.interactive3d")
      : entry.category === "business"
        ? t("category.business")
        : t("category.creative");

  return (
    <CaseFlipTransition origin={origin} onClosed={onClosed} closeLabel={t("common.close")}>
        <DialogHeader className="pr-10 text-left">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            {categoryLabel}
          </p>
          <DialogTitle className="font-display text-2xl font-medium">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <section className="space-y-3">
            <h3 className="font-display text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {t("detail.previewHeading")}
            </h3>

            <LiveFrame
              key={entry.id}
              url={entry.previewUrl}
              title={title}
            />
          </section>

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-5">
            <Button asChild>
              <a
                href={entry.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("card.preview")}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>

            {entry.remixUrl ? (
              <Button asChild variant="secondary">
                <a
                  href={entry.remixUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Remix
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </Button>
            ) : (
              <span
                aria-disabled="true"
                className="inline-flex h-11 cursor-not-allowed select-none items-center gap-2 rounded-md border border-border bg-secondary/60 px-4 text-sm font-medium text-muted-foreground opacity-70"
              >
                <Lock aria-hidden="true" className="h-4 w-4" />
                {t("card.remixComingSoon")}
              </span>
            )}

            {!entry.remixUrl && (
              <span className="text-xs text-muted-foreground">
                {t("card.remixUnavailable")}
              </span>
            )}
          </div>

          <div className="border-t border-border pt-5">
            <PromptPanel
              prompt={entry.prompt}
              promptKind={entry.promptKind}
              title={title}
            />
          </div>
        </div>
    </CaseFlipTransition>
  );
};
