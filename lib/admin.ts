import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function getCurrentProfile() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return profile;
}

export async function requireProfile(allowedRoles?: string[]) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/admin/login");
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    redirect("/admin");
  }

  return profile;
}
