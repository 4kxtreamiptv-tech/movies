import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("7starhd");
}

export default function Page() {
  return renderExtendedLanding("7starhd");
}
