import { Auth } from '@supabase/ui';
import { RecoilRoot } from 'recoil';
import AppStateRoot from './AppStateRoot';
import AuthenticatedApp from './AuthenticatedApp';
import { supabaseClient } from './utils/supabase';

function App() {
  const { user } = Auth.useUser();
  if (!user) return <Auth supabaseClient={supabaseClient} />;
  return (
    <RecoilRoot>
      <AppStateRoot>
        <AuthenticatedApp />
      </AppStateRoot>
    </RecoilRoot>
  );
}

export default App;
