import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("123movies");
}

export default function Page() {
  return renderExtendedLanding("123movies");
}
