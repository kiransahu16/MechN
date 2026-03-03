import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://briuebjnaopulqbzjiqz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyaXVlYmpuYW9wdWxxYnpqaXF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNzYwMjUsImV4cCI6MjA4Nzk1MjAyNX0.16G_-WVM5oltlfQVVKDhkZucF8aouOuIS4nowdpJ-tk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);