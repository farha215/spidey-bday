import { createClient } from "@supabase/supabase-js";
import type { Memory } from "@/components/memory-modal";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://natqyjlcienlysgnczad.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHF5amxjaWVubHlzZ25jemFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNjk3NTMsImV4cCI6MjEwNTg0NTc1M30.EavIbXzfnGTs0tiEUiwgv5fcOx4bUm5uNW_fz2lLkNo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchSharedMemories(): Promise<Memory[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return [];
    }
    return (data as Memory[]) || [];
  } catch (err) {
    console.error("Failed fetching Supabase memories:", err);
    return [];
  }
}

export async function saveSharedMemory(memory: Memory): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("memories")
      .insert([memory]);

    if (error) {
      console.error("Supabase insert error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed saving memory to Supabase:", err);
    return false;
  }
}

export async function deleteSharedMemory(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("memories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed deleting memory in Supabase:", err);
    return false;
  }
}

export async function clearAllSharedMemories(): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("memories")
      .delete()
      .neq("id", "0");

    if (error) {
      console.error("Supabase clear error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed clearing memories in Supabase:", err);
    return false;
  }
}
