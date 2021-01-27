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

class Notifications extends EventEmitter {
  username: String;
  token: String;
  voipToken: String;
  isIOS: Boolean;
  app: String;
  deviceId: String;

  constructor() {
    super();
    this.isIOS = Platform.OS === 'ios';
    this.call = this.call.bind(this);
    this.sendToken = this.sendToken.bind(this);
  }

  register(app, deviceId, username) {
    this.app = app;
    this.deviceId = deviceId;
    this.username = username;
    NotificationsReact.registerRemoteNotifications();
    NotificationsReact.events().registerRemoteNotificationsRegistered((event: Registered) => {
      this.token = event.deviceToken;
      // console.log('0..registerRemoteNotificationsRegistered', event.deviceToken)
      this.emit('registerRemoteNotificationsRegistered', event.deviceToken);
    });

    NotificationsReact.events().registerRemoteNotificationsRegistrationFailed((event: RegistrationError) => {
      // console.error('0..registerRemoteNotificationsRegistrationFailed', event);
      this.emit('registerRemoteNotificationsRegistrationFailed', event);
    });

    NotificationsReact.getInitialNotification()
      .then((notification) => {
        if (notification && notification.payload) {
          // console.log('0..getInitialNotification', notification.payload);
          this.emit('notificationOpened', notification.payload);
        }
      })
      .catch((err) => console.error("getInitialNotifiation() failed", err));

    NotificationsReact.events().registerNotificationReceivedForeground((notification: Notification, completion: (response: NotificationCompletion) => void) => {
      // console.log('0..registerNotificationReceivedForeground', notification.payload);
      this.emit('notificationOpened', notification.payload);

      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
      completion({alert: true, sound: true, badge: false});
    });

    NotificationsReact.events().registerNotificationReceivedBackground((notification: Notification, completion: (response: NotificationCompletion) => void) => {
      // console.log('0..registerNotificationReceivedBackground', notification.payload);
      this.emit('notificationOpened', notification.payload);
      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
      completion({alert: true, sound: true, badge: false});
    });

    NotificationsReact.events().registerNotificationOpened((notification: Notification, completion: () => void, action: NotificationActionResponse) => {
      // console.log(`Notification opened with an action identifier: ${action.identifier} and response text: ${action.text}`);
      this.emit('notificationOpened', notification.payload);
      completion();
    });
  }

  sendToken(remove = false) {
    const payload = {
      username: this.username,
      token: this.token,
      device: this.deviceId,
      app: this.app,
    };

    let url;
    if (this.isIOS) {
      url = !remove ? integrationBusSetIosTokenPath : integrationBusRemoveIosTokenPath;
    } else {
      url = !remove ? integrationBusSetAndroidTokenPath : integrationBusRemoveAndroidTokenPath
    }
   return this.call(url, payload);
  }

  sendVoipToken(remove = false) {
    const payload = {
      username,
      token: this.voipToken,
      device: this.deviceId,
      app: this.voipApp,
    };

    let url;
    if (this.isIOS) {
      url = !remove ? integrationBusSetIosTokenPath : integrationBusRemoveIosTokenPath;
    } else {
      url = !remove ? integrationBusSetAndroidTokenPath : integrationBusRemoveAndroidTokenPath
    }
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

  registerPushkit(app, deviceId, username): void {
    this.voipApp = app;
    this.deviceId = deviceId;
    this.username = username;
    NotificationsReact.ios.registerPushKit();
    NotificationsReact.ios
      .events()
      .registerPushKitRegistered((event: RegisteredPushKit) => {
        this.pushToken = event.pushKitToken;
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
}

export default new Notifications();
