import React from 'react';

interface Props {
  notifications?: any | any[];
  count?: number;
  unread?: number;
  connected?: boolean;
  readAll?: () => void,
  removeAll?: ()  => void,
  remove?: (id: string) => void;
  read?: (id: string) => void;
  unreadNotification?: (id: string) => void;
}

export const DEFAULT_STATE_BUS_NOTIFICATIONS = {
  notifications: [],
  count: 0,
  unread: 0,
  connected: false,
  readAll: undefined,
  removeAll: undefined,
  remove: undefined,
  read: undefined,
  unreadNotification: undefined,
}

export const BusNotificationsContext = React.createContext<Props>(DEFAULT_STATE_BUS_NOTIFICATIONS);
