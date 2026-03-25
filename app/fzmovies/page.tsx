import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("fzmovies");
}

export default function Page() {
  return renderExtendedLanding("fzmovies");
}
