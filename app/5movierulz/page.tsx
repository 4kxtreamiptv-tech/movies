import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("5movierulz");
}

export default function Page() {
  return renderExtendedLanding("5movierulz");
}
