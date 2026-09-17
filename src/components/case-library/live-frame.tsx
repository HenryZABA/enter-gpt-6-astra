import { ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

type LiveFrameProps = {
  /** Published preview URL, used verbatim. */
  url: string;
  /** Accessible iframe title, e.g. the case display title. */
  title: string;
  showExternalLink?: boolean;
  className?: string;
};

const SLOW_LOAD_MS = 12000;
const REVEAL_DELAY_MS = 1200;

/**
 * Live project frame used by the hero and detail dialog.
 *
 * It mounts immediately—there is no play/activation gate. Cross-origin projects
 * often emit `load` before their React/WebGL scene has painted, so the loading
 * veil remains briefly after that event to prevent a white flash. No `allow`
 * permissions are granted to the embedded document.
 */
export const LiveFrame = ({
  url,
  title,
  showExternalLink = true,
  className,
}: LiveFrameProps) => {
  const { t } = useTranslation();
  const [ready, setReady] = useState(false);
  const [slow, setSlow] = useState(false);
  const slowTimerRef = useRef<number | null>(null);
  const revealTimerRef = useRef<number | null>(null);

  useEffect(() => {
    slowTimerRef.current = window.setTimeout(
      () => setSlow(true),
      SLOW_LOAD_MS,
    );

    return () => {
      if (slowTimerRef.current !== null) {
        window.clearTimeout(slowTimerRef.current);
      }
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    if (slowTimerRef.current !== null) {
      window.clearTimeout(slowTimerRef.current);
      slowTimerRef.current = null;
    }
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
    }
    revealTimerRef.current = window.setTimeout(
      () => setReady(true),
      REVEAL_DELAY_MS,
    );
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="media-frame relative aspect-[16/10] w-full">
        <iframe
          src={url}
          title={title}
          loading="eager"
          referrerPolicy="no-referrer"
          onLoad={handleLoad}
          className="absolute inset-0 h-full w-full border-0 bg-card"
        />

        {!ready && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-secondary">
            <span className="font-mono text-xs text-muted-foreground">
              {t("live.loading")}
            </span>
          </div>
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        {ready ? t("live.ready") : ""}
      </p>

      {slow && !ready && (
        <p className="text-sm text-muted-foreground">{t("live.slow")}</p>
      )}

      {showExternalLink && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center gap-2 self-start text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
          {t("live.openPreview")}
        </a>
      )}
    </div>
  );
};
