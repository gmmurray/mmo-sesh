import { Fragment, useCallback, useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import {
  createNewItem,
  toggleCompletionStatus,
} from '../../backend/queries/session-items';
import { getSessionWithItems } from '../../backend/queries/sessions';
import { isValidUniqueIdentifier } from '../../backend/utilities/validId';

const getUpdatedItemCompletionList = (id, is_complete, items) => {
  return items.map(item => {
    if (item.id === id)
      return {
        ...item,
        is_complete,
      };
    else return item;
  });
};

const ViewSesh = () => {
  let { id: sessionId } = useParams();

  const [session, setSession] = useState({
    data: null,
    isLoading: false,
    isUpdating: false,
  });

  const [newItem, setNewItem] = useState({
    value: '',
    isLoading: false,
    isActive: false,
  });

  const loadSession = useCallback(async () => {
    setSession(state => ({ ...state, isLoading: true }));
    try {
      const { data, error } = await getSessionWithItems(sessionId);
      if (error) throw error;
      setSession(state => ({ ...state, data: data[0] || null }));
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setSession(state => ({ ...state, isLoading: false }));
    }
  }, [sessionId]);

  const loadRecurringItems = useCallback(async () => {}, []);

  const handleNewItemChange = useCallback(e => {
    setNewItem(state => ({ ...state, value: e.target.value }));
  }, []);

  const handleNewItemToggle = useCallback(() => {
    setNewItem(state => ({ ...state, isActive: !state.isActive, value: '' }));
  }, []);

  const handleNewItemSave = useCallback(async () => {
    setNewItem(state => ({ ...state, isLoading: true }));
    try {
      const { data, error } = await createNewItem({
        session_id: sessionId,
        content: newItem.value,
        is_complete: false,
      });
      if (error) throw error;
      setSession(state => ({
        ...state,
        data: {
          ...state.data,
          session_items: [data[0], ...state.data.session_items],
        },
      }));
      handleNewItemToggle();
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setNewItem(state => ({ ...state, isLoading: false }));
    }
  }, [handleNewItemToggle, newItem.value, sessionId]);

  const handleToggleItemCompletion = useCallback(
    async (itemId, currentStatus) => {
      setSession(state => ({ ...state, isUpdating: true }));
      try {
        const { data, error } = await toggleCompletionStatus(
          itemId,
          currentStatus,
        );
        if (error) throw error;
        const updatedItems = getUpdatedItemCompletionList(
          data[0].id,
          data[0].is_complete,
          session.data.session_items,
        );
        setSession(state => ({
          ...state,
          data: { ...state.data, session_items: updatedItems },
        }));
      } catch (error) {
        alert(error.error_description || error.message);
      } finally {
        setSession(state => ({ ...state, isUpdating: false }));
      }
    },
    [session.data?.session_items],
  );

  useEffect(() => {
    const initialize = async () => {
      await Promise.all([loadSession()]);
    };
    initialize();
  }, []);

  if (!sessionId || !isValidUniqueIdentifier(sessionId))
    return <Redirect to="/" />;
  else if (session.isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h4>View Sesh {session.data?.started_at}</h4>
      {session.data?.session_items?.length > 0 && (
        <div>
          <div>
            {!newItem.isActive ? (
              <button onClick={handleNewItemToggle}>create item +</button>
            ) : (
              <Fragment>
                <input
                  type="text"
                  value={newItem.value}
                  placeholder="create item +"
                  onChange={handleNewItemChange}
                  disabled={newItem.isLoading}
                />
                <button
                  onClick={handleNewItemSave}
                  disabled={newItem.isLoading}
                >
                  +
                </button>
                <button onClick={handleNewItemToggle}>x</button>
              </Fragment>
            )}
          </div>
          {session.data.session_items.map(item => (
            <Fragment key={item.id}>
              <hr />
              <div>
                <p>{item.is_complete ? 'Complete' : 'Incomplete'}</p>
                <p>{item.content}</p>
                <p>
                  <button
                    onClick={() =>
                      handleToggleItemCompletion(item.id, item.is_complete)
                    }
                    disabled={session.isUpdating}
                  >
                    toggle completion
                  </button>
                </p>
              </div>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewSesh;
