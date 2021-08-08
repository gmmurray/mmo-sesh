import { supabaseClient } from '../../../utils/supabase';

const gamesTable = 'games';

export const getGames = async () => {
  return await supabaseClient.from(gamesTable).select();
};
