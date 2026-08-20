"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Clock, X } from "lucide-react";
import { todo } from "@/config/siteConfig";
import { TodoText } from "./Todo";

/**
 * Peak / non-peak windows, lifted out of the Hours card into a dialog. Spelled
 * out in full the two windows run to several wrapped lines, which swamped the
 * card they shared with the opening hours.
 *
 * Base UI's Dialog (already a dependency) handles the focus trap, scroll lock
 * and Escape/outside-click dismissal; the open/close transitions hang off its
 * `data-starting-style` / `data-ending-style` attributes.
 */
export function HoursDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="hours-trigger">
        Peak &amp; non-peak hours
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="hours-backdrop" />
        <Dialog.Popup className="hours-popup">
          <div className="hours-popup-head">
            <span className="hours-popup-chip">
              <Clock className="hours-popup-chip-icon" strokeWidth={2} />
            </span>
            <div>
              <Dialog.Title className="hours-title">
                Peak &amp; non-peak hours
              </Dialog.Title>
              <Dialog.Description className="hours-desc">
                Open <TodoText>{todo.hours}</TodoText>, seven days a week.
              </Dialog.Description>
            </div>
          </div>

          <dl className="hours-bands">
            {todo.hourBands.map((band) => (
              <div key={band.label}>
                <dt className="hours-band-label">{band.label}</dt>
                <dd className="hours-band-value">
                  <TodoText>{band.hours}</TodoText>
                </dd>
              </div>
            ))}
          </dl>

          <Dialog.Close className="hours-close" aria-label="Close">
            <X className="hours-close-icon" strokeWidth={2.5} />
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
