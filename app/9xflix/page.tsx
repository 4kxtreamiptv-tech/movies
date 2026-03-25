import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("9xflix");
}

export default function Page() {
  return renderExtendedLanding("9xflix");
}
