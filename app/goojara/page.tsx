import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("goojara");
}

export default function Page() {
  return renderExtendedLanding("goojara");
}
