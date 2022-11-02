const { remote } = require('electron');
const BrowserWindow = remote.BrowserWindow;
export interface AuthResponse {
  authCode: string;
  authOptions: AuthOptions;
  event: any;
}
export interface AuthResponseKeyCloak {
  authCode: string;
}
export interface AuthOptions {
  hostname: string;
  clientId: string;
  clientSecret: string;
}
export const logoutKeyCloack = (urlEndPoint: string) => {
  const authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
  });
  const session = authWindow.webContents.session;
  session.clearStorageData();
  authWindow.loadURL(urlEndPoint);
  authWindow.on('close', () => {
    authWindow.destroy();
  });
  setTimeout(() => {
    authWindow.destroy();
  }, 2000);
  const handleCallback = (url: string) => {
    console.log('url', url);
  };
  authWindow.webContents.on('will-redirect', (event, url) => {
    event.preventDefault();
    handleCallback(url);
  });
};
export const authKeycloak = (): Promise<AuthResponseKeyCloak> => {
  return new Promise((resolve, reject) => {
    const authWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: true,
    });
    const session = authWindow.webContents.session;
    session.clearStorageData();
    authWindow.loadURL(
      'https://slinkid.ptit.edu.vn/auth/realms/master/protocol/openid-connect/auth?client_id=slink-electron&redirect_uri=http://localhost:13311&state=0c797441-7176-414a-a5c7-de68892ac0d7&response_mode=fragment&response_type=code&scope=openid&nonce=26ff93d9-e183-48ec-8541-bc3ae487814c'
    );
    authWindow.on('close', () => {
      authWindow.destroy();
    });
    // setTimeout(() => {
    //   authWindow.destroy();
    // }, 2000);
    const handleCallback = (url: string) => {
      console.log('url12', url);
      const raw_code = /code=([^&]*)/.exec(url) || null;
      console.log('raw', raw_code);
      const authCode = raw_code && raw_code.length > 1 ? raw_code[1] : '';
      setTimeout(() => {
        authWindow.destroy();
      }, 1000);
      resolve({ authCode });
    };
    const {
      session: { webRequest },
    } = authWindow.webContents;
    const filter = {
      urls: ['http://localhost/callback*'],
    };
    webRequest.onBeforeRequest(filter, async ({ url }) => {
      createAppWindow();
    });
    // authWindow.on('authenticated', () => {
    //   authWindow.close();
    // });
    authWindow.webContents.on('will-redirect', (event, url) => {
      event.preventDefault();
      handleCallback(url);
    });
    authWindow.webContents.on('will-navigate', function (event, newUrl) {
      console.log('new', newUrl);
      // More complex code to handle tokens goes here
    });
  });
};
function createAppWindow() {
  let win: any = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  win.loadFile('./renderers/home.html');

  win.on('closed', () => {
    win = null;
  });
}
