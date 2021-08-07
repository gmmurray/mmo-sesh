import { Auth } from '@supabase/ui';
import AuthenticatedApp from './AuthenticatedApp';
import { supabaseClient } from './utils/supabase';

function App() {
  const { user } = Auth.useUser();
  if (!user) return <Auth supabaseClient={supabaseClient} />;
  return <AuthenticatedApp />;
}

export default App;
