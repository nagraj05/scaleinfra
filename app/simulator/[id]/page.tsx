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
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden relative">
      {/* Mobile warning overlay */}
      <div className="md:hidden fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-8 text-center">
        <div className="text-4xl mb-4">🖥️</div>
        <h2 className="text-xl font-semibold mb-2">Better on larger screens</h2>
        <p className="text-muted-foreground text-sm">
          The simulator is not ideal for mobile devices. Please open it on a desktop or tablet for the best experience.
        </p>
      </div>

      <Navbar />
      {/* Spacer to account for fixed navbar */}
      <div className="h-20 w-full shrink-0" />

      <main className="flex-grow p-4 overflow-hidden relative">
        <SimulatorContainer initialData={simulation} />
      </main>
    </div>
  );
}
