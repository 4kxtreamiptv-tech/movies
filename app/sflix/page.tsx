import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("sflix");
}

export default function Page() {
  return renderExtendedLanding("sflix");
}
