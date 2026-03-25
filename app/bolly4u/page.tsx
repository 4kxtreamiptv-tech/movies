import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("bolly4u");
}

export default function Page() {
  return renderExtendedLanding("bolly4u");
}
