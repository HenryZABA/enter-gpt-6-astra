import { Download } from "lucide-react";
import { lazy, Suspense, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { CaseCard } from "@/components/case-library/case-card";
import type { CaseFlipOrigin } from "@/hooks/use-case-flip";
import { FilterBar } from "@/components/case-library/filter-bar";
import { HeroStage } from "@/components/case-library/hero-stage";
import { PromptDownloadSuccessDialog } from "@/components/case-library/prompt-download-success-dialog";
import { SiteFooter } from "@/components/case-library/site-footer";
import { SiteHeader } from "@/components/case-library/site-header";
import { Button } from "@/components/ui/button";
import { cases, casesWithPrompt, type CaseEntry } from "@/data/cases";
import { useCaseFilters } from "@/hooks/use-case-filters";
import { useCurrentLanguage } from "@/hooks/use-current-language";
import { buildPromptBundle } from "@/lib/prompt-bundle";
import { downloadTextFile } from "@/lib/prompt-file";

// Load the 3D transition and detail UI only after a case is opened.
const CaseDetailDialog = lazy(() =>
  import("@/components/case-library/case-detail-dialog").then((module) => ({
    default: module.CaseDetailDialog,
  })),
);

/** Stable 1-based position per case id, so cover numerals never shift on filter. */
const indexById = new Map(cases.map((entry, position) => [entry.id, position + 1]));

const Index = () => {
  const { t } = useTranslation();
  const language = useCurrentLanguage();

  const {
    query,
    setQuery,
    category,
    setCategory,
    filteredCases,
    categoryCounts,
  } = useCaseFilters();

  const [activeDetail, setActiveDetail] = useState<{
    entry: CaseEntry;
    origin: CaseFlipOrigin;
  } | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [downloadSuccessOpen, setDownloadSuccessOpen] = useState(false);
  const [downloadedPromptCount, setDownloadedPromptCount] = useState(0);
  const [selectedPromptIds, setSelectedPromptIds] = useState<Set<string>>(
    new Set(),
  );

  const openDetails = (entry: CaseEntry, origin: CaseFlipOrigin) => {
    if (!activeDetail) setActiveDetail({ entry, origin });
  };
  const closeDetails = useCallback(() => setActiveDetail(null), []);

  const toggleSelectionMode = () => {
    setSelectionMode((current) => !current);
    setSelectedPromptIds(new Set());
  };

  const setPromptSelected = (id: string, selected: boolean) => {
    setSelectedPromptIds((current) => {
      const next = new Set(current);
      if (selected) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const downloadPrompts = (entries: CaseEntry[], fileName: string) => {
    const content = buildPromptBundle(entries, t, language);
    const ok = downloadTextFile(fileName, content);
    if (ok) {
      setDownloadedPromptCount(entries.length);
      setDownloadSuccessOpen(true);
    } else {
      toast.error(t("bundle.failed"));
    }
  };

  const selectedPrompts = casesWithPrompt.filter((entry) =>
    selectedPromptIds.has(entry.id),
  );

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <HeroStage />

        <section
          id="cases"
          aria-labelledby="cases-heading"
          className="ambient-section scroll-mt-16 border-t border-border/60 py-16 lg:py-24"
        >
          <div className="container">
            <div className="flex flex-col gap-6 pb-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <span className="block h-px w-8 bg-primary" />
                <h2
                  id="cases-heading"
                  className="font-display text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl"
                >
                  {t("gallery.heading")}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={toggleSelectionMode}
                  aria-pressed={selectionMode}
                  className={`rounded-full border-border bg-card/70 text-xs ${selectionMode ? "" : "prompt-download-cta"}`}
                >
                  <Download aria-hidden="true" />
                  {t("bundle.buttonWithCount", { value: casesWithPrompt.length })}
                </Button>
                {selectionMode && <Button
                  type="button"
                  variant="outline"
                  disabled={selectedPrompts.length === 0}
                  onClick={() =>
                    downloadPrompts(
                      selectedPrompts,
                      "gpt6-astra-selected-prompts.md",
                    )
                  }
                  className="prompt-download-cta rounded-full border-transparent bg-card/70 text-xs"
                >
                  <Download aria-hidden="true" />
                  {t("bundle.downloadSelectedCount", {
                    value: selectedPrompts.length,
                  })}
                </Button>}
              </div>
            </div>

          <FilterBar
            query={query}
            onQueryChange={setQuery}
            category={category}
            onCategoryChange={setCategory}
            categoryCounts={categoryCounts}
          />

          {filteredCases.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCases.map((entry) => (
                <CaseCard
                  key={entry.id}
                  entry={entry}
                  index={indexById.get(entry.id) ?? 1}
                  selectionMode={selectionMode}
                  selected={selectedPromptIds.has(entry.id)}
                  onSelectedChange={(selected) =>
                    setPromptSelected(entry.id, selected)
                  }
                  onOpenDetails={openDetails}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-dashed border-border bg-card p-10 text-center">
              <p className="font-display text-lg font-medium text-foreground">
                {t("gallery.emptyTitle")}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                {t("gallery.emptyBody")}
              </p>
            </div>
          )}
          </div>
        </section>
      </main>

      <SiteFooter />

      <PromptDownloadSuccessDialog
        open={downloadSuccessOpen}
        onOpenChange={setDownloadSuccessOpen}
        count={downloadedPromptCount}
      />

      {activeDetail && (
        <Suspense fallback={null}>
          <CaseDetailDialog
            key={activeDetail.entry.id}
            entry={activeDetail.entry}
            origin={activeDetail.origin}
            onClosed={closeDetails}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Index;
