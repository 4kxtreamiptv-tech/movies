import type { Metadata } from 'next';
import AllTVSeriesClient from "./AllTVSeriesClient";

export const metadata: Metadata = {
  title: 'All TV Series - Browse Complete Collection',
  description: 'Browse our complete collection of TV series and shows online.',
};

export default function AllTVSeriesPage() {
  return (
    <AllTVSeriesClient />
  );
}
