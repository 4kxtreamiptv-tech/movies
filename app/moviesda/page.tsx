import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("moviesda");
}

export default function Page() {
  return renderExtendedLanding("moviesda");
}
