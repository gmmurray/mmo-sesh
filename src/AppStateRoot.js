import { Fragment, useCallback, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { getGames } from './backend/queries/games';
import { gameState } from './recoil/games';

const AppStateRoot = props => {
  const setGamesState = useSetRecoilState(gameState);

  const initializeGameOptions = useCallback(async () => {
    try {
      const { data, error } = await getGames();
      if (error) throw error;
      setGamesState(state => ({ ...state, options: data }));
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setGamesState(state => ({ ...state, isLoading: false }));
    }
  }, [setGamesState]);

  useEffect(() => {
    const initialize = async () => {
      await Promise.all([initializeGameOptions()]);
    };

    initialize();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <Fragment>{props.children}</Fragment>;
};

export default AppStateRoot;
