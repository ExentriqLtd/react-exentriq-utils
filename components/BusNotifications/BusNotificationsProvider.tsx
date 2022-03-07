import { get } from 'lodash';
import React, { FC, useCallback, useEffect, useReducer } from 'react';
import { BusNotificationsContext } from './BusNotificationsContext';
import { WSNotifications } from './wsNotifications';

interface TState {
  notifications?: any | any[];
  count?: number | 0;
  connected?: boolean | false;
  unread?: number | 0;
}

interface TBusProps {
  children: any;
  url: string;
  username?: string | null | undefined;
  appState?: string | null | undefined;
}
const reducer = (s: TState, v: TState) => ({ ...s, ...v });
export const BusNotificationsProvider: FC<TBusProps> = ({ children, url, username, appState }): JSX.Element => {
  const [state, setState] = useReducer(reducer, { notifications: [], count: 0, connected: false });

  const unreadNotification = useCallback((id: string) => {
    setTimeout(() => {
      WSNotifications.unreadNotification(id);
    }, 200);
  }, []);

  const read = useCallback((id: string) => {
    setTimeout(() => {
      WSNotifications.readNotification(id);
    }, 200);
  }, []);

  const remove = useCallback((id: string) => {
    WSNotifications.removeNotification(id);
  }, []);

  const readAll = useCallback(() => {
    setTimeout(() => {
      WSNotifications.readAllNotifications();
    }, 200);
  }, []);

  const removeAll = useCallback(() => {
    setTimeout(() => {
      WSNotifications.removeAllNotifications();
    }, 200);
  }, []);

  const callback = ({ data, unread }: any) => {
    setState({
      notifications: data || [],
      count: data ? data.length : 0,
      unread,
    });
  }

  const callbackConnected = (result: boolean) => {
    setState({ connected: result });
  }

  useEffect(() => {
    if (!username) return;
    WSNotifications.init({ url, username });
    WSNotifications.on('update', callback);
    WSNotifications.on('connected', callbackConnected);
    return () => {
      WSNotifications.off('update', callback);
      WSNotifications.off('connected', callbackConnected);
    }
  }, [username]);

  const value = React.useMemo(() => ({
    notifications: get(state, 'notifications'),
    unread: get(state, 'unread', 0),
    count: get(state, 'count', 0) || 0,
    readAll,
    removeAll,
    remove,
    read,
    unreadNotification,
  }), [state, readAll, removeAll, remove, read]);

  return (
    <BusNotificationsContext.Provider value={value}>
      {children}
    </BusNotificationsContext.Provider>
  );
}

BusNotificationsProvider.displayName = 'BusNotificationsProvider';
