import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("filmy4web");
}

export default function Page() {
  return renderExtendedLanding("filmy4web");
}
