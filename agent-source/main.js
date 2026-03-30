const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
const screenshot = require('screenshot-desktop');
const activeWin = require('active-win');
const os = require('os');

// --- CONFIGURATION ---
const API_BASE_URL = 'http://localhost:5000/api'; // Change to your production URL
let employeeId = null; // Should be set after user enters it or via deep link
let deviceId = os.hostname() + '-' + os.userInfo().username;
let heartbeatInterval = null;
let captureInterval = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    // Hide from taskbar if desired
    // skipTaskbar: true,
  });

  win.loadFile('index.html');
}

// --- AGENT LOGIC ---

async function registerAgent() {
  try {
    const systemInfo = {
      platform: os.platform(),
      release: os.release(),
      arch: os.arch(),
      cpus: os.cpus().length,
      memory: Math.round(os.totalmem() / 1024 / 1024 / 1024) + 'GB'
    };

    await axios.post(`${API_BASE_URL}/agent/register`, {
      employeeId,
      deviceId,
      systemInfo
    });
    console.log('Agent registered successfully');
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
}

async function sendHeartbeat() {
  try {
    await axios.post(`${API_BASE_URL}/agent/heartbeat`, { deviceId });
  } catch (error) {
    console.error('Heartbeat failed:', error.message);
  }
}

async function captureAndUpload() {
  try {
    // 1. Capture Screenshot
    const imgBuffer = await screenshot();
    const screenshotUrl = `data:image/png;base64,${imgBuffer.toString('base64')}`;

    // 2. Get Active Window
    const win = await activeWin();
    const activityStatus = win ? 'active' : 'idle';

    // 3. Upload Data
    await axios.post(`${API_BASE_URL}/tracking/upload`, {
      employeeId,
      screenshotUrl,
      activityStatus,
      location: 'System-based'
    });

    console.log('Tracking data uploaded');
  } catch (error) {
    console.error('Capture/Upload failed:', error.message);
  }
}

app.whenReady().then(() => {
  createWindow();

  // Mocked: In real scenario, user would login or enter ID
  // For demo, we assume employeeId is known
  // employeeId = 'YOUR_EMPLOYEE_ID';
  
  if (employeeId) {
    registerAgent();
    heartbeatInterval = setInterval(sendHeartbeat, 60000); // 1 min
    captureInterval = setInterval(captureAndUpload, 300000); // 5 mins
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
