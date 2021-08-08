import { supabaseClient } from '../../../utils/supabase';
import { sessionItemsTable } from '../session-items';

const sessionsTable = 'sessions';

export const createSession = async (user_id, game_id) => {
  return await supabaseClient.from(sessionsTable).insert({ user_id, game_id });
};

export const getIncompleteSessions = async limit => {
  return await supabaseClient
    .from(sessionsTable)
    .select(`id, started_at, ${sessionItemsTable}(id, is_complete, content)`)
    .eq(`${sessionItemsTable}.is_complete`, false)
    .limit(limit, { foreignTable: sessionItemsTable });
};
