import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";
import { createClient } from "@/lib/supabase/server";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let portalHref = "/login";
  let portalLabel = "Login";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      portalHref = "/admin";
      portalLabel = "Admin Portal";
    } else if (profile?.role === "coach") {
      portalHref = "/coach";
      portalLabel = "My Portal";
    } else {
      portalHref = "/dashboard";
      portalLabel = "My Dashboard";
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar portalHref={portalHref} portalLabel={portalLabel} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}
