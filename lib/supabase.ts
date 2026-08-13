import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://fkfaxrdfomsavcbtrqaa.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrZmF4cmRmb21zYXZjYnRycWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NjA0NTQsImV4cCI6MjA4NzIzNjQ1NH0.eobGMgBn7-6bWO8m8vl1kqlUreiDMF9VCBr6q0Nz95Y"; // Paste your actual long key from .env.local here if this truncated placeholder differs

export const supabase = createClient(supabaseUrl, supabaseAnonKey);