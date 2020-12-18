// #region ::: IMPORT
import {
  TParamsLogin,
  TParamsGoogleLogin,
  TParamsSignup,
  TParamsConnect,
} from './declarations/types.Service.Params';
import { Socket } from './Socket';
import Guardian from './Guardian';
// #endregion

class ServiceImplementation {
  ddp = null;
  reconnectInterval = null;
  connectedPromise = null;
  loginToken = null;
  userId = null;
  rid = null;
  context = null;
  user = null;
  sessionToken = null;

  getToken() {
    return this.loginToken;
  }
  // #region ::: CONNECTION
  connect = async ({
    url,
    callbackOnConnected,
    callbackOnDisconnected,
    callbackOnDisconnectedByUser,
    callbackOnReconnect,
    callbackOnOpenConnection,
  }: TParamsConnect): Promise<void> => {
    if (this.ddp) {
      this.ddp.disconnect();
    }

    this.ddp = new Socket(url);

    this.connectedPromise = new Promise((resolve) => {
      this.ddp.on('disconnected_by_user', () => {
        callbackOnDisconnectedByUser();
      });

      this.ddp.on('disconnected', () => {
        callbackOnDisconnected();
        if (this.reconnectInterval) {
          clearInterval(this.reconnectInterval);
          delete this.reconnectInterval;
        }

        this.reconnectInterval = setInterval(
          () => this.reconnect(callbackOnReconnect),
          2000,
        );
      });

      this.ddp.on('open', async () => {
        callbackOnOpenConnection();
        resolve();
      });

      this.ddp.on('error', (err) => console.error('[DDP].Error', err));
      this.ddp.on('connected', async () => {
        if (this.reconnectInterval) {
          clearInterval(this.reconnectInterval);
          delete this.reconnectInterval;
        }
        if (this.loginToken) {
          this.call('login', { resume: this.loginToken });
        }

        callbackOnConnected();
        resolve();
      });
    });

    return this.ddp;
  };

  reconnect = (callbackOnReconnect): void => {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      delete this.reconnectInterval;
    }
    if (this.ddp) {
      callbackOnReconnect();
      this.ddp.reconnect();
    }
  };

  isConnected = async (): Promise<any> => this.connectedPromise;

  disconnect = async (): Promise<void> => {
    if (!this.ddp) {
      return;
    }

    this.ddp.disconnect();
    delete this.ddp;
  };

  call = async (method, ...params): Promise<any> => {
    if (!this.ddp) {
      return new Error('DDP is not initialized');
    }
    await this.isConnected();

    return this.ddp.call(method, ...params);
  };

  createSession = (guardianToken: string): Promise<any> => {
    if (!guardianToken) {
      return {};
    }
    return this.call('verifyToken', guardianToken)
      .then((verifyToken) => {
        if (!verifyToken) {
          return {};
        }
        const { sessionToken, loginToken, status, _id } = verifyToken;
        return this.call('login', { resume: loginToken })
          .then((session) => {
            this.userId = _id;
            this.loginToken = loginToken;
            this.sessionToken = sessionToken;
            return { session, status, sessionToken };
          })
          .catch((err) =>
            console.error('[Service].verifyToken.session', err),
          );
      })
      .catch((err) => console.error('[Service.createSession', err));
  };
  // #endregion

  // #region ::: AUTH
  login = async ({ username, password }: TParamsLogin): Promise<any> => {
    return Guardian.call('auth.login', [username, password], null)
      .then((user) => {
        const { sessionToken: token } = user || {};
        if (token) {
          return this.createSession(token)
            .then((session) => {
              return session;
            })
            .catch((err) => {
              console.error('[Service].login.createSession.error', err);
              return null;
            });
        }
        return null;
      })
      .catch((e) => {
        console.error('[Service].Login.Error', e);
        return null;
      });
  };

  generateLoginCode = async ({ spaceId, sessionToken }): Promise<any> => {
    return Guardian.call('spaceUserService.generateLoginCode', [spaceId], sessionToken);
  }

  pairQRCode = async ({ spaceId, qrCode, sessionToken }): Promise<any> => {
    return Guardian.call('spaceUserService.pairQRCode', [spaceId, qrCode], sessionToken);
  }

  loginByDeviceId = async ({ deviceId, spaceId, secretCode }): Promise<any> => {
    return Guardian.call('spaceUserService.loginByDeviceId', [deviceId, spaceId, secretCode], null);
  } ;

  loginByGoogle = async ({
    id,
    name,
    firstName,
    lastName,
    gender,
    pictureUrl,
    email,
    token,
    app,
  }: TParamsGoogleLogin): Promise<any> => {
    const params = [
      id,
      name,
      firstName,
      lastName,
      gender,
      pictureUrl,
      email,
      null,
      'free',
      '',
      token,
      app,
    ];

    const response = await Guardian.call(
      'auth.loginByGoogle',
      params,
    );

    return response;
  };

  signup = async ({
    username: name,
    email,
    password,
  }: TParamsSignup): Promise<any> => {
    const params = [
      name,
      password,
      name,
      '',
      'M',
      '01-01-1900',
      '',
      '',
      email,
      '',
      '',
      '',
      'free',
      '',
      '',
    ];

    return Guardian.call(
      'accountService.create',
      params,
      null,
    )
      .then((response) => {
        const { error } = response || {};
        if (error) {
          return error;
        }
        return response;
      })
      .catch((err) => {
        console.error('[Service].signup.error', err);
        return null;
      });
  };

  recoveryPassword = async (email: String): Promise<boolean> => {
    return Guardian.call('accountService.forgotPassword', [email], null)
      .then((response) => {
        return response;
      })
      .catch((err) => console.error('[Servic+e.recoveryPassword', err));
  };

  getUserDetail = (username: String, sessionToken: String): Promise<TParamsLogin> => {
    return Guardian.call('accountService.getUserDetailByUsername', [username], sessionToken)
      .then((result) => {
        return result;
      })
      .catch((err) => console.error(`[GetUserDetail.${username}]', ${err}`));

  }

  // #endregion
  sendIosToken = async (username: String, data: Object<any>) => {
    this.call('sendIosTokenUsername', username, data);
  };

  removeIosToken = async (username: String, data: Object<any>) => {
    this.call('removeIosTokenUsername', username, data);
  };

  sendAndroidTokenUsername = (username: String, token: String) => {
    this.call('sendAndroidTokenUsername', username, token);
  };

  removeAndroidTokenUsername = (username: String, token: String) => {
    this.call('removeAndroidTokenUsername', username, token);
  };
  // #endregion
}

export const Service = new ServiceImplementation();
