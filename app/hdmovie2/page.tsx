import { getExtendedLandingMetadata, renderExtendedLanding } from "@/lib/extendedLandingPage";

export async function generateMetadata() {
  return getExtendedLandingMetadata("hdmovie2");
}

export default function Page() {
  return renderExtendedLanding("hdmovie2");
}
