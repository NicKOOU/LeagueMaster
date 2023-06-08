const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  
  //const backendProcess = spawn('node', [path.join(__dirname, 'backend', 'main.js')]);

  mainWindow.loadURL('http://localhost:8080'); 

  mainWindow.webContents.openDevTools();


  /*backendProcess.on('exit', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });

  backendProcess.on('error', (err) => {
    console.error('Backend process error:', err);
  });*/
  

  mainWindow.on('closed', () => {
    //backendProcess.kill();
    app.quit();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
