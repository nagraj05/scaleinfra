import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function diagnose() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  console.log("Checking table structure...");
  const { data, error } = await supabase.rpc('get_table_info', { t_name: 'simulations' });
  
  if (error) {
    if (error.message.includes("function get_table_info(text) does not exist")) {
      console.log("Helper function missing. Running direct query...");
      const { data: cols, error: colError } = await supabase
        .from('simulations')
        .select('*')
        .limit(1);
        
      if (colError) {
        console.error("Error accessing table:", colError.message);
      } else {
        console.log("Table exists and is accessible.");
      }
    } else {
      console.error("Error diagnostic:", error.message);
    }
  } else {
    console.log("Table columns:", data);
  }
}

diagnose();
