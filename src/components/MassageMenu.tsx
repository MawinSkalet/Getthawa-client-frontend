import { getPackage } from "@/hooks/usePackage";
import { buildBookingGroups } from "@/lib/bookingCatalog";
import LocalizedMenu from "@/components/LocalizedMenu";

export default async function MassageMenu() {
  return <LocalizedMenu groups={buildBookingGroups(await getPackage())} />;
}
