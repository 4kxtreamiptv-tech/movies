import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("netfree");
}

export default function Page() {
  return renderExtendedLanding("netfree");
}
