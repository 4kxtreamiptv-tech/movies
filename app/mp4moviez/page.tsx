import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("mp4moviez");
}

export default function Page() {
  return renderExtendedLanding("mp4moviez");
}
