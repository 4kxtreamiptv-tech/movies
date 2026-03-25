import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("prmovies");
}

export default function Page() {
  return renderExtendedLanding("prmovies");
}
