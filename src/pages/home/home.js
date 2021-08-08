import { Fragment, useCallback, useEffect, useState } from 'react';
import { Auth } from '@supabase/ui';
import Select from 'react-select';
import { getGames } from '../../backend/queries/games';
import {
  createSession,
  getIncompleteSessions,
} from '../../backend/queries/sessions';
import { useHistory } from 'react-router-dom';

const getGameSelectOptions = games =>
  games.map(({ id, image_url, name }) => ({ value: id, label: name }));

const INCOMPLETE_SESH_LIMIT = 3;

const Home = () => {
  const { user } = Auth.useUser();
  let history = useHistory();
  const [isInitializing, setIsInitializing] = useState(true);

  const [gameOptions, setGameOptions] = useState({ data: [], loading: false });
  const [selectedGame, setSelectedGame] = useState(null);

  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [incompleteSessions, setIncompleteSessions] = useState({
    data: [],
    loading: false,
  });

  const loadGameOptions = useCallback(async () => {
    setGameOptions(state => ({ ...state, loading: true }));
    try {
      const { data, error } = await getGames();
      setGameOptions(state => ({ ...state, data: getGameSelectOptions(data) }));
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setGameOptions(state => ({ ...state, loading: false }));
    }
  }, []);

  const loadIncompleteSessions = useCallback(async () => {
    setIncompleteSessions(state => ({ ...state, loading: true }));
    try {
      const { data, error } = await getIncompleteSessions(
        INCOMPLETE_SESH_LIMIT,
      );
      setIncompleteSessions(state => ({
        ...state,
        data: data.filter(s => s.session_items.length),
      }));
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setIncompleteSessions(state => ({ ...state, loading: false }));
    }
  }, []);

  const handleNewSesh = useCallback(async () => {
    setIsCreateLoading(true);
    try {
      const { data, error } = await createSession(user.id, selectedGame.value);
      if (error) throw error;
      if (data && data[0].id) history.push(`/sesh/view/${data[0].id}`);
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setIsCreateLoading(false);
    }
  }, [history, selectedGame?.value, user.id]);

  useEffect(() => {
    const initialize = async () => {
      await Promise.all([loadGameOptions(), loadIncompleteSessions()]);
    };

    initialize().then(() => setIsInitializing(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isInitializing) return <div>loading...</div>;
  return (
    <Fragment>
      <div>Home</div>
      <hr />
      {incompleteSessions.data.length > 0 && (
        <div>
          <h4>continue sesh</h4>
          <ul>
            {incompleteSessions.data.map(
              ({ id, game_id, started_at, session_items }) => (
                <li key={id}>
                  {started_at}
                  <ul>
                    {(session_items || []).map(({ id, content }) => (
                      <li key={id}>{content}</li>
                    ))}
                  </ul>
                </li>
              ),
            )}
          </ul>
        </div>
      )}
      <div>
        <h4>new sesh</h4>
        <p>
          <Select
            value={selectedGame}
            onChange={selected => setSelectedGame(selected)}
            options={gameOptions.data}
          />
          <button
            onClick={handleNewSesh}
            disabled={gameOptions.loading || isCreateLoading}
          >
            Click
          </button>
        </p>
      </div>
      <div>
        <h4>settings</h4>
      </div>
    </Fragment>
  );
};

export default Home;
