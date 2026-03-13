import { Navbar } from "@/components/shared/navbar";
import SimulatorContainer from "@/components/features/simulator/simulator-board";
import { createSupabaseClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function SimulatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  const { getToken } = await auth();
  
  if (!user) redirect("/sign-in");

  const token = await getToken({ template: "supabase" });
  const supabase = createSupabaseClient(token || undefined);

  const { data: simulation } = await supabase
    .from("simulations")
    .select("*")
    .eq("id", id)
    .single();

  if (!simulation) redirect("/dashboard");
  if (simulation.user_id !== user.id) redirect("/dashboard");

  return (
    <div className="h-screen flex flex-col bg-muted/30 overflow-hidden">
      <Navbar />
      <main className="flex-grow pt-20 p-4 overflow-hidden">
        <SimulatorContainer initialData={simulation} />
      </main>
    </div>
  );
}
