import { Notifications as NotificationsReact } from 'react-native-notifications';
import EventEmitter from 'events';
import uuid from 'uuid';
import {
  integrationBusSetIosTokenPath,
  integrationBusSetAndroidTokenPath,
  integrationBusRemoveAndroidTokenPath,
  integrationBusRemoveIosTokenPath,
  notificationVoipAppName,
} from './config';
import Guardian from './Guardian';

import type { RegisteredPushKit } from 'react-native-notifications';

class Notifications extends EventEmitter {
  _uuid: String;
  _username: String;
  _token: String;
  _isIOS: Boolean;

  constructor(_uuid) {
    super();
    this._uuid = _uuid || uuid.v4().toUpperCase();
    this._isIOS = Platform.OS === 'ios';
  }

  init(uuid, username) {
    this._uuid = uuid;
    this._username = username;

    NotificationsReact.registerRemoteNotifications();
    NotificationsReact.events().registerRemoteNotificationsRegistered(
      (event) => {
        // TODO: Send the token to my server so it could send back push notifications...
        // console.log('0..[Device Token Received]', event.deviceToken);
        this.emit('registerRemoteNotificationsRegistered', event.deviceToken);
      },
    );
    NotificationsReact.events().registerRemoteNotificationsRegistrationFailed(
      (event) => {
        console.error(
          '[RegisterRemoteNotificationsRegistrationFailed]',
          event,
        );
      },
    );
    NotificationsReact.events().registerNotificationReceivedForeground(
      (
        notification: Notification,
        completion: (response: NotificationCompletion) => void,
      ) => {
        // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
        completion({ alert: true, sound: true, badge: false });
      },
    );
    NotificationsReact.events().registerNotificationOpened(
      (
        notification: Notification,
        completion: () => void,
        action: NotificationActionResponse,
      ) => {
        completion();
      },
    );
    NotificationsReact.events().registerNotificationReceivedBackground(
      (
        notification: Notification,
        completion: (response: NotificationCompletion) => void,
      ) => {
        // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
        completion({ alert: true, sound: true, badge: false });
      },
    );

    if (this._isIOS) {
      this.registerPushkit();
    }
  }

  registerPushkit(): void {
    NotificationsReact.ios.registerPushKit();
    NotificationsReact.ios
      .events()
      .registerPushKitRegistered((event: RegisteredPushKit) => {
        this._token = event.pushKitToken;
        this.emit('registerPushKitRegistered', event.pushKitToken);
        this.sendVoipToken();
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

  sendVoipToken(): void {
    if (!this._token || !this._username) {
      return;
    }

    const payload = {
      username: this._username,
      token: this._token,
      device: this._uuid,
      app: notificationVoipAppName,
    };

    const options = {
      method: 'POST',
      body: JSON.stringify({ id: '', payload }),
    };

    if (this._isIOS) {
      return Guardian.fetch(integrationBusSetIosTokenPath, options);
    }
    Guardian.fetch(integrationBusSetAndroidTokenPath, options);
  }

  removeVoipToken(): void {
    const payload = {
      data: {
        username: this._username,
        token: this._token,
        app: notificationVoipAppName,
      },
    };
    const options = {
      method: 'POST',
      body: JSON.stringify({ id: '', payload }),
    };
    if (this._isIOS) {
      return Guardian.fetch(integrationBusRemoveIosTokenPath, options);
    }
    Guardian.fetch(integrationBusRemoveAndroidTokenPath, options);
  }
}

export default new Notifications();
