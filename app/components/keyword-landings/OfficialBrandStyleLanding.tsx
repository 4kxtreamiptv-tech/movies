import LandingVariant1 from "@/components/LandingVariant1";
import LandingVariant2 from "@/components/LandingVariant2";
import LandingVariant3 from "@/components/LandingVariant3";
import LandingVariant4 from "@/components/LandingVariant4";
import LandingVariant5 from "@/components/LandingVariant5";
import LandingVariant6 from "@/components/LandingVariant6";
import LandingVariant7 from "@/components/LandingVariant7";
import LandingVariant8 from "@/components/LandingVariant8";
import LandingVariant9 from "@/components/LandingVariant9";
import LandingVariant10 from "@/components/LandingVariant10";
import type { ComponentType } from "react";
import type { ExtendedLandingConfig, OfficialStylePreset } from "./types";

const presetToVariant: Record<OfficialStylePreset, ComponentType<any>> = {
  m123: LandingVariant1,
  gostream: LandingVariant2,
  putlocker: LandingVariant3,
  bflix: LandingVariant4,
  netfree: LandingVariant5,
  filmyhit: LandingVariant6,
  movierulz5: LandingVariant7,
  sevenstarhd: LandingVariant8,
  hdmovie2: LandingVariant9,
  ssrmovies: LandingVariant10,
  "nine-x-movies": LandingVariant1,
  kuttymovies: LandingVariant2,
  sflix: LandingVariant3,
  "nine-x-flix": LandingVariant4,
  prmovies: LandingVariant5,
  filmy4web: LandingVariant6,
  goojara: LandingVariant7,
  bolly4u: LandingVariant8,
  moviesda: LandingVariant9,
  filmy4wap: LandingVariant10,
  mp4moviez: LandingVariant1,
  ibomma: LandingVariant2,
  fzmovies: LandingVariant3,
};

export default function OfficialBrandStyleLanding({ config }: { config: ExtendedLandingConfig }) {
  const Variant = presetToVariant[config.preset] || LandingVariant1;
  return (
    <Variant
      keyword={config.keyword}
      description={config.description}
      colorTheme={config.colorTheme}
      content={config.content}
    />
  );
}
