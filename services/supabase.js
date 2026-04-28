import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sinwmknzamiddjaestfl.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbndta256YW1pZGRqYWVzdGZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNjQwOTAsImV4cCI6MjA5MTY0MDA5MH0.O-cVgSbrvXEqwV064ru_VM9qAjdi9dqNyznzcVZn7Yo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
