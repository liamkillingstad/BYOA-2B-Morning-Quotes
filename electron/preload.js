const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveEntry: (data) => ipcRenderer.invoke('save-entry', data),
  getEntries: () => ipcRenderer.invoke('get-entries'),
  closeApp: () => ipcRenderer.invoke('close-app'),
  minimizeApp: () => ipcRenderer.invoke('minimize-app'),
});
