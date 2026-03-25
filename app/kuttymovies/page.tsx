import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("kuttymovies");
}

export default function Page() {
  return renderExtendedLanding("kuttymovies");
}
