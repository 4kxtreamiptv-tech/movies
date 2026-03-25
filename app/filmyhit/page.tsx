import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("filmyhit");
}

export default function Page() {
  return renderExtendedLanding("filmyhit");
}
