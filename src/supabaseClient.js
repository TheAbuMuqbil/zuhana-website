import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zlrnuhedudtsgitwahgl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpscm51aGVkdWR0c2dpdHdhaGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NTA5OTYsImV4cCI6MjEwMzMyNjk5Nn0.TEKGYdsp2YteVxc9O7-6GlSAjkCWuEZaPy736Z2IsPU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
