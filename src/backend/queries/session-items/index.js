import { supabaseClient } from '../../../utils/supabase';

export const sessionItemsTable = 'session_items';

export const toggleCompletionStatus = async (id, currentStatus) =>
  await supabaseClient
    .from(sessionItemsTable)
    .update({ is_complete: !currentStatus })
    .match({ id });

export const createNewItem = async ({
  session_id,
  content,
  is_complete = false,
}) =>
  await supabaseClient
    .from(sessionItemsTable)
    .insert({ session_id, content, is_complete });

export const deleteItem = async id =>
  await supabaseClient.from(sessionItemsTable).delete().match({ id });
