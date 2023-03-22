import { createClient } from '@supabase/supabase-js';

const Supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export default Supabase;
