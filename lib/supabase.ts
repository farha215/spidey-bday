import { createClient } from "@supabase/supabase-js";
import type { Memory } from "@/components/memory-modal";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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
