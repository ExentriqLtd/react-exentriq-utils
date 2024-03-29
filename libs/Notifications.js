import { Notifications as NotificationsReact } from 'react-native-notifications';
import EventEmitter from 'events';
import {
  integrationBusSetIosTokenPath,
  integrationBusSetAndroidTokenPath,
  integrationBusRemoveAndroidTokenPath,
  integrationBusRemoveIosTokenPath,
} from './config';
import Guardian from './Guardian';

import type { RegisteredPushKit } from 'react-native-notifications';
import { Platform } from 'react-native';

class Notifications extends EventEmitter {
  username: String;
  token: String;
  voipToken: String;
  isIOS: Boolean;
  app: String;
  deviceId: String;
  sentPush: Boolean;
  sentVoip: Boolean;
  initializetedPush: Boolean;
  initializetedPushKit: Boolean;

  constructor() {
    super();
    this.isIOS = Platform.OS === 'ios';
    this.call = this.call.bind(this);
    this.sendToken = this.sendToken.bind(this);
    this.sentPush = false;
    this.sentVoip = false;
    this.initializetedPush = false;
    this.initializetedPushKit = false;
  }

  unRegister() {
    this.initializetedPush = false;
    this.sentPush = false;
  }

  register(app, deviceId, username) {
    this.app = app;
    this.deviceId = deviceId;
    this.username = username;

    if (this.initializetedPush) return;
    this.initializetedPush = true;

    NotificationsReact.registerRemoteNotifications();
    NotificationsReact.events().registerRemoteNotificationsRegistered((event: Registered) => {
      this.token = event.deviceToken;
      // console.log('0..registerRemoteNotificationsRegistered', event.deviceToken)
      this.emit('registerRemoteNotificationsRegistered', event.deviceToken, this.username);
    });

    NotificationsReact.events().registerRemoteNotificationsRegistrationFailed((event: RegistrationError) => {
      // console.error('0..registerRemoteNotificationsRegistrationFailed', event);
      this.emit('registerRemoteNotificationsRegistrationFailed', event, this.username);
    });

    NotificationsReact.getInitialNotification()
      .then((notification) => {
        if (notification && notification.payload) {
          // console.log('0..getInitialNotification', notification.payload);
          this.emit('notificationOpened', notification.payload, this.isIOS);
        }
      })
      .catch((err) => console.error("getInitialNotifiation() failed", err));

    NotificationsReact.events().registerNotificationReceivedForeground((notification: Notification, completion: (response: NotificationCompletion) => void) => {
      console.log('0..registerNotificationReceivedForeground', JSON.stringify(notification.payload, null, 2));
      this.emit('notificationForeground', notification.payload, this.isIOS);
      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
      completion({alert: false, sound: false, badge: false });
    });

    NotificationsReact.events().registerNotificationReceivedBackground((notification: Notification, completion: (response: NotificationCompletion) => void) => {
      // console.log('0..registerNotificationReceivedBackground', notification.payload);
      this.emit('notificationBackground', notification.payload, this.isIOS);
      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
      completion({alert: true, sound: true, badge: false});
    });

    NotificationsReact.events().registerNotificationOpened((notification: Notification, completion: () => void, action: NotificationActionResponse) => {
      // console.log(`Notification opened with an action identifier: ${action.identifier} and response text: ${action.text}`);
      console.log('0..Notification.OPENED', notification.payload);
      this.emit('notificationOpened', notification.payload, this.isIOS);
      completion();
    });
  }

  requestRegister(username) {
    this.username = username;
    this.sendToken();
  }

  sendToken(username) {
    if (this.sentPush) return;
    if (username) {
      this.username = username;
    }
    if (!this.username || !this.token) {
      return
    }
    const payload = {
      username: this.username,
      token: this.token,
      device: this.deviceId,
      app: this.app,
    };
    let url;
    if (this.isIOS) {
      url = integrationBusSetIosTokenPath;
    } else {
      url = integrationBusSetAndroidTokenPath;
    }
    this.sentPush = true;
    return this.call(url, payload);
  }

  removeToken() {
    this.sentVoip = false;
    const payload = {
      username: this.username,
      token: this.token,
      device: this.deviceId,
      app: this.app,
    };

    let url;
    if (this.isIOS) {
      url = integrationBusRemoveIosTokenPath;
    } else {
      url = integrationBusRemoveAndroidTokenPath
    }
    this.unRegister();
    return this.call(url, payload);
  }

  sendVoipToken() {
    if (this.sentVoip) return;
    const payload = {
      username: this.username,
      token: this.voipToken,
      device: this.deviceId,
      app: this.voipApp,
    };

    let url;
    if (this.isIOS) {
      url = integrationBusSetIosTokenPath;
    } else {
      url = integrationBusSetAndroidTokenPath;
    }
    this.sentVoip = true;
    return this.call(url, payload);
  }

  removeVoipToken() {
    this.sentVoip = false;
    const payload = {
      username,
      token: this.voipToken,
      device: this.deviceId,
      app: this.voipApp,
    };

    let url;
    if (this.isIOS) {
      url = integrationBusRemoveIosTokenPath;
    } else {
      url = integrationBusRemoveAndroidTokenPath
    }
    this.unRegisterPuskit();
    return this.call(url, payload);
  }

  call(url, payload) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    return new Promise((resolve) => {
      return Guardian.fetch(url, options)
        .then(resolve)
        .catch((err) => resolve({ error: true, ...err }));
      });
  }

  unRegisterPuskit() {
    this.initializetedPushKit = false;
    this.sentVoip = false;
  }

  registerPushkit(app, deviceId, username): void {
    this.voipApp = app;
    this.deviceId = deviceId;
    this.username = username;
    if (this.initializetedPushKit) return;

    this.initializetedPushKit = true;
    NotificationsReact.ios.registerPushKit();
    NotificationsReact.ios
      .events()
      .registerPushKitRegistered((event: RegisteredPushKit) => {
        this.voipToken = event.pushKitToken;
        this.emit('registerPushKitRegistered', event.pushKitToken);
      });
    NotificationsReact.ios
      .events()
      .registerPushKitNotificationReceived(
        (payload: object, complete: Function) => {
          this.emit('registerPushKitNotificationReceived', payload);
          complete();
        },
      );
  }

  setBadgeCount(count) {
    if (Platform.OS === 'ios') {
      NotificationsReact.ios.setBadgeCount(count);
    }
  }

}

export default new Notifications();
