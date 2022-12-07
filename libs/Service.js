// #region ::: IMPORT
import {
  TParamsLogin,
  TParamsGoogleLogin,
  TParamsSignup,
  TParamsConnect,
} from './declarations/types.Service.Params';
import { Socket } from './Socket';
import Guardian from './Guardian';
import { isFunction } from 'lodash';
import { Settings } from 'react-native';
import { URL_REJECT_MEET_INVITE } from 'exentriq-utils/constants/config';
// #endregion

class ServiceImplementation {
  static instance = null;
  ddp = null;
  reconnectInterval = null;
  userId = null;
  spaceId = null;
  context = null;
  rooms = {};
  uploadInstances = [];
  sessionToken = null;
  callbackWsAuthenticated = (data) => {};
  debug = true;
  meteorLoginToken = null;


  getToken() {
    return this.meteorLoginToken;
  }
  
  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  static getInstance() {
    if (!ServiceImplementation.instance) {
      ServiceImplementation.instance = new ServiceImplementation();
    }
    return ServiceImplementation.instance;
  }


  ddpEventsConnection = async ({ callbackOnDisconnectedByUser, callbackOnDisconnected, callbackOnOpenConnection, callbackWsAuthenticated, callbackOnConnected }:any) => {
    return new Promise(resolve => {
      if (!this.ddp) {
        console.error('ddpEventsConnection:::: ddp is not initialized')
        return;
      };
  
      this.ddp.on('disconnected_by_user', () => {
        console.log('[EDO] socket:::WS.DDP-DISCONNECTED-BY-USER');
        this.resetStreamers();
        callbackOnDisconnectedByUser();
      });
  
      this.ddp.on('disconnected', () => {
        console.log('[EDO] socket:::WS.DDP-DISCONNECTED');
        callbackOnDisconnected();
        callbackOnDisconnectedByUser();
  
        if (this.reconnectInterval) {
          clearInterval(this.reconnectInterval);
          this.reconnectInterval = null;
        }
      });
  
      this.ddp.on('open', async () => {
        console.log('[EDO] socket:::WS..DDP-OPEN')
        callbackOnOpenConnection();
      });
      
      this.ddp.on('connected', async () => {
        console.log('[EDO] socket:::WS..DDP-CONNECTED', this.sessionToken)
        if (this.reconnectInterval) {
          clearInterval(this.reconnectInterval);
          this.reconnectInterval = null;
        }
  
        if (this.sessionToken) {
          console.log('[EDO] socket:::TRY::Ws.DDP.AUTH-BY-SESSION-TOKEN', this.sessionToken);
          this.call('login', { resume: this.sessionToken }).then((session) => {
            console.log('[EDO] socket:::WS.LOGIN-AUTH-BY-SESSION-TOKEN::RESULT:', session);
            const { id: userId } = session || {};
            if (userId) {
              this.userId = userId;
            }
            callbackWsAuthenticated({ ...session, sessionToken: this.sessionToken });
          });
        }
  
        //---EF-5-AUTH
        callbackOnConnected();
        resolve('ok');
      });
    });
  
  }
  
  // #region ::: CONNECTION
  connect = async ({
    url,
    spaceId,
    callbackOnConnected,
    callbackOnDisconnected,
    callbackOnDisconnectedByUser,
    callbackOnReconnect,
    callbackOnOpenConnection,
    callbackWsAuthenticated,
  }) => {
    this.callbackWsAuthenticated = callbackWsAuthenticated;
    if (!this.isConnected()) {
      console.log('[EDO] new Socket(url)::socket:::to:::', url);
      this.ddp = new Socket(url);
      // @ts-ignore
      this.spaceId = spaceId;
     
      await this.ddpEventsConnection({
        callbackOnConnected,
        callbackOnDisconnected,
        callbackOnDisconnectedByUser,
        callbackOnReconnect,
        callbackOnOpenConnection,
        callbackWsAuthenticated,
      });
    }
    return this.ddp;
  };

  isConnected = () => {
    // CONNECTING 0 The connection is not yet open.
    // OPEN       1 The connection is open and ready to communicate.
    // CLOSING    2 The connection is in the process of closing.
    // CLOSED     3 The connection is closed or couldn't be opened.
    if(!this.ddp?.ws) return false;
    const code = this.ddp.ws.readyState;
    this.debug && console.log(` [EDO]
    // CONNECTING 0 The connection is not yet open.
    // OPEN       1 The connection is open and ready to communicate.
    // CLOSING    2 The connection is in the process of closing.
    // CLOSED     3 The connection is closed or couldn't be opened.
        ---------- isConnect:::: CURRENT STATUS:::${code} ----------
    `);
    return code === 1;
  }

  disconnect = async (): Promise<void> => {
    this.userId = null;
    this.sessionToken = null;
    this.resetStreamers();
    if (this.ddp) {
      this.ddp.disconnect();
    };
  };

  call = async (method, ...params): Promise<any> => {
    console.log('[EDO] socket:::WS..DDP-CALL::', { method, params });
    if (!this.isConnected()) return false;
    return this.ddp.call(method, ...params);
  };

  createSession = async (guardianToken: string): Promise<any> => {
    console.log('[EDO] socket:::WS..DDP-Create-Session', guardianToken);
    if (!guardianToken) {
      return Promise.resolve({});
    }
    this.sessionToken = guardianToken;
    return this.call('verifyToken', guardianToken)
      .then((verifyToken) => {
        console.log('[EDO] socket:::WS..DDP-Create-Session.verifyToken', verifyToken)
        if (!verifyToken) {
          this.sessionToken = null;
          return {};
        }
        const { loginToken, status, _id } = verifyToken;
        console.log('[EDO] socket:::WS..DDP-Create-Session.loginToken', loginToken)
        return this.call('login', { resume: loginToken })
          .then((session) => {
            console.log('[EDO] socket:::WS..DDP-Create-Session.resume', session)
            if (isFunction(this.callbackWsAuthenticated)) {
              this.callbackWsAuthenticated({ ...session, sessionToken: this.sessionToken });
            }
            console.log('[EDO] socket:::WS..DDP-Create-Session.login.session', session)
            this.userId = _id;
            this.meteorLoginToken = session.token;
            Settings.set({ userId: _id, rejectMeetInviteUrl: URL_REJECT_MEET_INVITE });
            return { session, sessionToken: this.sessionToken, status, _id, restored: undefined };
          })
          .catch((err) =>
            console.warn('[Service].verifyToken.session', err),
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
  }

  loginByDeviceIdV2 = async ({ deviceId, spaceId, secretCode }): Promise<any> => {
    return Guardian.call('spaceUserService.loginByDeviceIdV2', [deviceId, spaceId, secretCode], null);
  }

  loginBySession = async (sessionToken: String) => {
    const tokens = await this.call('verifyToken', sessionToken);
    const { loginToken, _id } = tokens;
    return this.call('login', { resume: loginToken }).then(() => {
      this.userId = _id;
      console.log('[EDO] Logged as:', this.userId);
    });
  }

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

  getUserBySessionToken = (spaceId: String, sessionToken: String): Promise<TParamsLogin> => {
    return Guardian.call('spaceUserService.getUserBySessionToken', [spaceId, sessionToken])
      .then((result) => {
        return result;
      })
      .catch((err) => console.error(`[GetUserDetail.${username}]', ${err}`));
    }

  refreshSpaceSession = (spaceId: String, sessionToken: String): Promise<TParamsLogin> => {
    return Guardian.call('spaceUserService.refreshSession', [spaceId], sessionToken)
      .then((result) => {
        return result;
      })
      .catch((err) => console.error(`[GetUserDetail.${username}]', ${err}`));
    }

  getUserDetail = (username: String, sessionToken: String): Promise<TParamsLogin> => {
    return Guardian.call('accountService.getUserDetailByUsername', [username], sessionToken)
      .then((result) => {
        return result;
      })
      .catch((err) => console.error(`[GetUserDetail.${username}]', ${err}`));

  }

  getUserDetailRegisteredUser = (username: String, spaceId: String, sessionToken: String): Promise<TParamsLogin> => {
    if (!spaceId) {
      return Guardian.call('accountService.getUserDetailByUsername', [username], sessionToken)
      .then((result) => {
        return result;
      })
      .catch((err) => console.error(`[getUserDetailByUsername.${username}]', ${err}`));
    }
    return Guardian.call('accountService.getUserDetailByUsernameAndSpace', [username, spaceId], sessionToken)
      .then((result) => {
        return result;
      })
      .catch((err) => console.error(`[getUserDetailRegisteredUser.${username}]', ${err}`));
  }

  uploadGroupAvatar = (groupId, avatarBase64, spaceId, sessionToken) => {
    return Guardian.call('spaceUserService.uploadGroupAvatar', [spaceId, groupId, avatarBase64], sessionToken).then((result) => {
      return result;
    })
    .catch((err) => console.error(`[uploadGroupAvatar.error]', ${err.message}`));
  }

  closeAccount = (sessionToken) => {
    return Guardian.call(
      'accountService.removeGloballyAccount',
      [],
      sessionToken
    ) .then((result) => {
      console.log('[EDO] accountService.removeGloballyAccount:::::::::',result)
      return result;
    })
    .catch((err) => console.error(`[removeGloballyAccount.error]', ${err.message}`));
  }

  updateAccount = ({ firstName, lastName, email, base64, sessionToken }) => {
    return Guardian.call('accountService.updateMyUserData', [
      firstName, lastName, email, base64], sessionToken)
      .then((result) => {
        return result;
      })
      .catch((err) => console.error(`[updateAccount.error]', ${err.message}`));
  }

  updateProfile = ({
    audienceContactId, firstName, lastName, email, phone,
    base64, sessionToken, spaceId, language,
  }) => {
    return Guardian.call('spaceUserService.updateAudienceContactAndMetaFromApp', [
      spaceId, audienceContactId, firstName, lastName, email, phone,
      null, null, base64, null, null, null, language], sessionToken)
      .then((result) => {
        return result;
      })
      .catch((err) => console.error(`[updateProfile.error]', ${err.message}`));
  };

  sendVerificationCodeByEmail = ({ deviceId, email, phone, spaceId, secretCode }) => {
    return Guardian.call('spaceUserService.sendVerificationCodeByEmail', [deviceId, email, phone, spaceId, secretCode])
      .then((result) => {
        return result;
      });
  }

  verifyDeviceIdByEmail = ({ deviceId, spaceId, code, secretCode, firstName, lastName, phone, email, language, base64 }) => {
    return Guardian.call('spaceUserService.verifyDeviceIdByEmail', [deviceId, spaceId, code, secretCode, firstName, lastName, phone, email, language, base64])
      .then((result) => {
        return result;
      });
  }

  // #endregion

  // #region ::: NOTIFICATIONS
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
