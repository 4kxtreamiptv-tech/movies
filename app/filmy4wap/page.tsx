import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("filmy4wap");
}

export default function Page() {
  return renderExtendedLanding("filmy4wap");
}
