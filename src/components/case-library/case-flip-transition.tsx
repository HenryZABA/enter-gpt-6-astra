import * as DialogPrimitive from "@radix-ui/react-dialog";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

import { useCaseFlip, type CaseFlipOrigin } from "@/hooks/use-case-flip";

type CaseFlipTransitionProps = {
  origin: CaseFlipOrigin;
  onClosed: () => void;
  closeLabel: string;
  children: ReactNode;
};

export const CaseFlipTransition = ({
  origin,
  onClosed,
  closeLabel,
  children,
}: CaseFlipTransitionProps) => {
  const { phase, target, reducedMotion, requestClose, onBackAnimationComplete } =
    useCaseFlip(origin, onClosed);
  const showBack = phase === "opening-back" || phase === "open" || phase === "closing-back";
  const closing = phase === "closing-back";

  return (
    <LazyMotion features={domAnimation}>
      {!showBack && createPortal(
        <div className="case-flip-guard" aria-hidden="true" onPointerDown={requestClose} />,
        document.body,
      )}
      <DialogPrimitive.Root
        open={showBack}
        onOpenChange={(next) => { if (!next) requestClose(); }}
      >
        {showBack && (
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay asChild>
              <m.div
                className="case-flip-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: closing ? 0 : 1 }}
                transition={{ duration: reducedMotion ? 0.12 : 0.32 }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              asChild
              onCloseAutoFocus={(event) => event.preventDefault()}
            >
              <m.div
                className="case-flip-back"
                style={{ ...target, transformPerspective: 1400 }}
                initial={{ rotateY: reducedMotion ? 0 : -90, opacity: reducedMotion ? 0 : 1 }}
                animate={{ rotateY: reducedMotion ? 0 : closing ? -90 : 0, opacity: reducedMotion && closing ? 0 : 1 }}
                transition={{
                  duration: reducedMotion ? 0.12 : 0.32,
                  ease: closing ? [0.55, 0, 0.8, 0.45] : [0.16, 1, 0.3, 1],
                }}
                onAnimationComplete={onBackAnimationComplete}
              >
                <button type="button" className="case-flip-close" aria-label={closeLabel} onClick={requestClose}>
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
                <div className="case-flip-content">{children}</div>
              </m.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </DialogPrimitive.Root>
    </LazyMotion>
  );
};
