import { useContext } from 'react';
import { BusNotificationsContext } from './BusNotificationsContext';

export const useBusNotifications = (): any => {
  return useContext(BusNotificationsContext);
}
