import { Fragment, useCallback } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom';
import Home from './pages/home/home';
import NewItem from './pages/sesh/items/new-item';
import ViewSesh from './pages/sesh/view-sesh';
import { supabaseClient } from './utils/supabase';

const AuthenticatedApp = () => {
  const handleSignout = useCallback(() => supabaseClient.auth.signOut(), []);
  return (
    <Fragment>
      <Router>
        <div>
          <button onClick={handleSignout}>Sign out</button>
        </div>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/sesh/items/new">
            <NewItem />
          </Route>
          <Route path="/sesh/view/:id">
            <ViewSesh />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Router>
    </Fragment>
  );
};

export default AuthenticatedApp;
// add react router
// add 3 cards: new sesh, previous sesh, settings
// sesh: select game. add session goals. add repeating goals by selecting what interval (daily vs weekly). show weekly/daily tasks on top which you can mark as completed.
// settings: change weekly/daily reset times
// repeating goals on sesh: repeating goals which match this game, shown across all sessions. each goal has a status and completion time. if status is true and completion time is AFTER reset time, it is considered completed
