const { app, BrowserWindow, powerMonitor, screen, ipcMain } = require('electron');
const path = require('path');
const { saveEntry, getEntries } = require('./database');

let mainWindow = null;
let hasShownThisSession = false;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().bounds;
  
  mainWindow = new BrowserWindow({
    width,
    height,
    fullscreen: true,
    fullScreenable: true,
    title: 'Daily Reflections',
    backgroundColor: '#5c2d38',
    show: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const isDev = process.env.ELECTRON_START_URL;
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function showMorningFlow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    mainWindow.focus();
  } else {
    createWindow();
  }
}

ipcMain.handle('save-entry', (_, entry) => {
  try {
    saveEntry(entry);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-entries', () => {
  try {
    return getEntries();
  } catch (err) {
    return [];
  }
});

ipcMain.handle('close-app', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close();
  }
});

ipcMain.handle('minimize-app', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.minimize();
  }
});

app.whenReady().then(() => {
  createWindow();
  hasShownThisSession = true;

  // Show on wake from sleep
  powerMonitor.on('resume', () => {
    setTimeout(showMorningFlow, 500);
  });

  // Show when screen is unlocked
  powerMonitor.on('unlock-screen', () => {
    setTimeout(showMorningFlow, 500);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else {
    showMorningFlow();
  }
});
