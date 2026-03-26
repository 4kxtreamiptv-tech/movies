import { OfficialPresetLanding } from "./OfficialBrandPresets";
import type { ExtendedLandingConfig } from "./types";

/** Extended SEO routes: per-keyword preset hero + article (REFERENCE_EXPORT). */
export default function OfficialBrandStyleLanding({ config }: { config: ExtendedLandingConfig }) {
  return (
    <OfficialPresetLanding
      preset={config.preset}
      keyword={config.keyword}
      description={config.description}
      content={config.content}
      colorTheme={config.colorTheme}
    />
  );
}
