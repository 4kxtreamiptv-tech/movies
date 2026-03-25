import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("ibomma");
}

export default function Page() {
  return renderExtendedLanding("ibomma");
}
