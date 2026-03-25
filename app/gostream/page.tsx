import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("gostream");
}

export default function Page() {
  return renderExtendedLanding("gostream");
}
