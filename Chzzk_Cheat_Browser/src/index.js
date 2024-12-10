const { app, BrowserWindow, session, Menu } = require('electron');
const path = require('node:path');
const started = require('electron-squirrel-startup');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const Filter = {
  urls: []
}
const AdFilter = {
  urls: [
    '*://tvetamovie.pstatic.net/*',
    '*://glad-vod.pstatic.net/*',
  ]
}

const trackerFilter = {
  urls: [
    '*://apis.naver.com/mcollector/mcollector/qoe',
    '*://lcs.naver.com/*',
    '*://scv-game.io.naver.com/jackpotlog/v1/logs',
    '*://siape.veta.naver.com/openrtb/nurl',
    '*://gfp.veta.naver.com/*',
    '*://apis.naver.com/policy/policy/policy',
    '*://ssl.pstatic.net/static/nng/resource/p/static/js/lcslog.js',
    '*://ssl.pstatic.net/tveta/libs/glad/prod/gfp-core.js',
    '*://tivan.naver.com/sc2/*']
}

let isFilterOn = true;
let isAdFilterOn = true;
let isTracterFilterOn = true;

const template = [
  {
    label: 'option',
    submenu: [
      {
        label: '그리드',
        type: 'checkbox',
        checked: isFilterOn,
        click: () => {
          isFilterOn = !isFilterOn;
        }
      },
      {
        label: '광고',
        type: 'checkbox',
        checked: isAdFilterOn,
        click: () => {
          isAdFilterOn = !isAdFilterOn;
        }
      },
      {
        label: '기타 트래커',
        type: 'checkbox',
        checked: isTracterFilterOn,
        click: () => {
          isTracterFilterOn = !isTracterFilterOn;
        }
      }
    ]
  }
]


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'chzzk_browser.png')
  });

  // and load the index.html of the app.
  //mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.loadURL("https://chzzk.naver.com",
    { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' }
  );

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  session.defaultSession.webRequest.onBeforeSendHeaders(Filter, (details, callback) => {
    if(isFilterOn)
    {
      details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
      details.requestHeaders['sec-ch-ua-platform'] = 'macOS';
      details.requestHeaders['sec-ch-ua'] = 'Not A;Brand";v="99", "Chromium";v="130", "Google Chrome";v="130';
    }

    callback({ requestHeaders: details.requestHeaders })
  });

  session.defaultSession.webRequest.onBeforeRequest(AdFilter, (details, callback) => {
    callback({ cancel: true });
  });

  // session.defaultSession.webRequest.onBeforeRequest(trackerFilter, (details, callback) => {
  //   callback({ cancel: true });
  // });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.



//const menu = Menu.buildFromTemplate(template);
//Menu.setApplicationMenu(menu)