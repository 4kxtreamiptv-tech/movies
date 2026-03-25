import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("putlocker");
}

export default function Page() {
  return renderExtendedLanding("putlocker");
}
