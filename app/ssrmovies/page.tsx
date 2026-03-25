import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("ssrmovies");
}

export default function Page() {
  return renderExtendedLanding("ssrmovies");
}
