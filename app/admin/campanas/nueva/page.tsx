import { AdminShell } from "@/components/admin/admin-shell";
import { NewCampaignForm } from "@/components/admin/new-campaign-form";

export default function NewCampaignPage() {
  return (
    <AdminShell>
      <NewCampaignForm />
    </AdminShell>
  );
}
