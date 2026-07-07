"use client";

import { useEffect, useState } from "react";
import { SiteOriginal } from "./SiteOriginal";
import { SiteLuxury } from "./luxe/SiteLuxury";
import { VersionToggle, type Version } from "./VersionToggle";

const KEY = "apollo-version";

/**
 * Renders one of the two site versions and a floating toggle to switch. The
 * chosen version persists in localStorage and can be deep-linked with ?v=luxury.
 */
export function SiteSwitcher() {
  const [version, setVersion] = useState<Version>("v1");

  useEffect(() => {
    // Restore the persisted / deep-linked preference after mount (kept out of
    // the initial render to avoid a hydration mismatch; default stays "v1").
    let next: Version = "v1";
    try {
      const param = new URLSearchParams(window.location.search).get("v");
      const stored = window.localStorage.getItem(KEY);
      if (param) {
        next = param === "2" || param === "luxury" || param === "v2" ? "v2" : "v1";
      } else if (stored === "v2") {
        next = "v2";
      }
    } catch {
      /* no-op */
    }
    if (next !== "v1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVersion(next);
    }
  }, []);

  function change(v: Version) {
    setVersion(v);
    try {
      window.localStorage.setItem(KEY, v);
    } catch {
      /* no-op */
    }
    window.scrollTo({ top: 0 });
  }

  return (
    <>
      {version === "v2" ? <SiteLuxury /> : <SiteOriginal />}
      <VersionToggle version={version} onChange={change} />
    </>
  );
}
