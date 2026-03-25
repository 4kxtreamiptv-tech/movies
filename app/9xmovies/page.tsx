import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("9xmovies");
}

export default function Page() {
  return renderExtendedLanding("9xmovies");
}
