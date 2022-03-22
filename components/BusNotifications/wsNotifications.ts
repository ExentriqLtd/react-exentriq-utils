import EventEmitter from "events";

interface wsMsg {
  cmd?: string;
  id?: string;
  value?: string | null | undefined;
}

export interface TBusInit{
  url: string;
  username: string;
}

export interface TWSNotifications {
  id: string;
  from_name: string;
  from_user: string;
  link?: string;
  message?: string;
  notified?: number | Boolean;
  picture?: string;
  sent_by_mail?: any;
  status?: any;
  link_params?: any;
  subject?: string;
  tags?: any;
  timestamp: any;
  to_user: string;
  type: any;
}

const WSNotifications = new (class extends EventEmitter {
  ddp: any;
  username: string | null;
  notifications: TWSNotifications[];
  serviceInitialized: boolean;
  service: any;
  socketOpened: boolean;
  emit: any;
  on: any;
  off: any;
  reconnectInterval: any;
  url: string;

  constructor() {
    super();
    this.service = undefined;
    this.serviceInitialized = false;
    this.notifications = [];
    this.username = null;
    this.socketOpened = false;
    this.reconnectInterval = undefined;
  }

  set(username: string) {
    this.username = username;
  }

  createNotification(message: any) {
    // Check is valid notification
    if (!this.isValid('notification', message)) {
      return null;
    }
    return message;
  }

  updateAllNotifications(data: any) {
    const notifications: any[] = [];

    data.value.forEach((message: any) => {
      const item = this.createNotification(message);
      if (item) {
        notifications.push(item);
      }
    });
    this.notifications = ([...notifications]);

    this.emit('update', { data: [...notifications], unread: this.notificationsCount() });
  }

  addNotification(message: any) {
    const notifications = this.notifications;
    const item = this.createNotification(message);
    if (item) {
      notifications.push(item);
    }
    this.notifications = ([...notifications]);
    this.emit('update', { data: [...notifications], unread: this.notificationsCount() });
  }

  unreadNotification(id: string) {
    this.wsUnreadNotificationById(id);
    const notifications = this.notifications;
    let isUpdate = false;
    for (let i = 0; i < notifications.length; i += 1) {
      const notification = notifications[i];
      if (notification.id === id && notification.notified === 1) {
        notifications[i] = { ...notification, notified: 0 };
        isUpdate = true;
        break;
      }
    }
    if (isUpdate) {
      this.notifications = ([...notifications]);
      this.emit('update', { data: [...notifications], unread: this.notificationsCount() });
    }
  }

  readNotification(id: string) {
    this.wsReadNotificationById(id);
    const notifications = this.notifications;
    let isUpdate = false;
    for (let i = 0; i < notifications.length; i += 1) {
      const notification = notifications[i];
      if (notification.id === id && notification.notified !== 1) {
        notifications[i] = { ...notification, notified: 1 };
        isUpdate = true;
        break;
      }
    }
    if (isUpdate) {
      this.notifications = ([...notifications]);
      this.emit('update', { data: [...notifications], unread: this.notificationsCount() });
    }
  }

  readAllNotifications() {
    const notifications = this.notifications;
    let isUpdate = false;
    for (let i = 0; i < notifications.length; i += 1) {
      const notification = notifications[i];
      if (notification.notified === 0) {
        notifications[i] = { ...notification, notified: 1 };
        isUpdate = true;
      }
    }
    this.wsReadAllNotifications();
    if (isUpdate) {
      this.notifications = ([...notifications]);
      this.emit('update', { data: [...notifications], unread: this.notificationsCount() });
    }
  }

  removeNotification(id: string) {
    this.wsRemoveNotificationById(id);
    const notifications = this.notifications;
    let isUpdate = false;
    for (let i = 0; i < notifications.length; i += 1) {
      const notification = notifications[i];
      if (notification.id === id) {
        notifications.splice(i, 1);
        isUpdate = true;
        break;
      }
    }
    if (isUpdate) {
      this.notifications = ([...notifications]);
      this.emit('update', { data: [...notifications], unread: this.notificationsCount() });
    }
  }

  removeAllNotifications() {
    this.wsRemoveAllNotifications();
    this.notifications = ([]);
    this.emit('update', { data: [], count: 0 });
  }

  notificationsCount() {
    const notifications = this.notifications;
    let count = 0;
    for (let i = 0; i < notifications.length; i += 1) {
      const notification = notifications[i];
      if (notification.notified === 0) {
        count += 1;
      }
    }
    return count;
  }

  isValid(validate: string, object: any) {
    let { link } = object;
    link = link.replace('&#x2F;', '/');
    const { from_user: fromUser = '', subject, type } = object;
    let valid = true;

    switch (validate) {
      case 'notification':
        if (link.indexOf('/channel') === 0 || link.indexOf('/direct') === 0) {
          valid = false;
        }
        if (subject.indexOf('chat.unreadmessages:') === 0) {
          valid = false;
        }
        if (type === 'TASK_STATUS') {
          valid = false;
        }
        if (fromUser.indexOf('talk.stage') > -1) {
          valid = false;
        }
        break;
      case 'task':
        valid = false;
        if (type === 'TASK_STATUS') {
          valid = true;
        }

        if (link.indexOf('/channel') === 0 || link.indexOf('/direct') === 0) {
          valid = false;
        }
        if (subject.indexOf('chat.unreadmessages:') === 0) {
          valid = false;
        }
        if (fromUser.indexOf('talk.stage') > -1) {
          valid = false;
        }
        break;
      default:
        valid = false;
    }

    return valid;
  }

  wsReadNotificationById(id: string) {
    const msg: wsMsg = { cmd: 'READ' };
    msg.value = id;
    this.service.send(JSON.stringify(msg));
  }

  wsUnreadNotificationById(id: string) {
    const msg: wsMsg = { cmd: 'UNREAD' };
    msg.value = id;
    this.service.send(JSON.stringify(msg));
  }

  wsRemoveNotificationById(id: string) {
    const msg: wsMsg = { cmd: 'DELETE' };
    msg.value = id;
    this.service.send(JSON.stringify(msg));
  }

  wsListAllNotifications() {
    const msg: wsMsg = { cmd: 'ALL' };
    msg.value = this.username;
    this.service.send(JSON.stringify(msg));
  }

  wsNewNotifications() {
    const msg: wsMsg = { cmd: 'NEW' };
    msg.value = this.username;
    this.service.send(JSON.stringify(msg));
  }

  wsRemoveAllNotifications() {
    const msg: wsMsg = { cmd: 'DELETE_ALL' };
    msg.value = this.username;
    this.service.send(JSON.stringify(msg));
  }

  wsReadAllNotifications() {
    const msg: wsMsg = { cmd: 'READ_ALL' };
    msg.value = this.username;
    this.service.send(JSON.stringify(msg));
  }

  wsShowNewNotifications () {
    const msg: wsMsg = { cmd: 'SHOW_NEW' };
    msg.value = this.username;
    this.service.send(JSON.stringify(msg));
  }

  retry() {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      delete this.reconnectInterval;
    }
    this.reconnectInterval = setInterval(
      () => this.reconnect({ username: this.username, url: this.url }),
      2000,
    );
  }

  reconnect(args: any) {
    if (!this.serviceInitialized) {
      this.init(args);
    }
  }

  disconnect = (): void => {
    this.service.close();
  };

  init({ url, username }: TBusInit) {
    if (!username || !url) {
      return;
    }
    this.serviceInitialized = true;
    this.username = username;
    this.url = url;

    // Socket
    if (this.service) this.disconnect();

    this.service = new WebSocket(url);

    // Message
    this.service.onmessage = (event: any) => {
      const data = JSON.parse(event.data);
      if (data.cmd === 'LIST_ALL') {
        // Update all notifications
        this.updateAllNotifications(data);
      } else if (data.cmd === 'NOTIFICATION') {
        setTimeout(() => {
          this.wsListAllNotifications();
        }, 2000);
        // Add notification
        this.addNotification(data.value);
      }
    };

    this.service.onopen = () => {
      this.socketOpened = true;
      this.emit('connected', true);

      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        delete this.reconnectInterval;
      }

      // List all notifications
      this.wsListAllNotifications();

      // New notifications
      this.wsNewNotifications();
    };

    this.service.onclose = (evt: any) => {
      this.serviceInitialized = false;
      this.emit('connected', false);
      this.retry();
    };

    this.service.onerror = (evt: any) => {
      this.emit('error', evt);
    };
  }

  get() {
    return this.notifications;
  }

  isInit() {
    return this.serviceInitialized;
  }

})();

export { WSNotifications };
