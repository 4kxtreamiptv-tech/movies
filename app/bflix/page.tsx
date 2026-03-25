import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("bflix");
}

export default function Page() {
  return renderExtendedLanding("bflix");
}
