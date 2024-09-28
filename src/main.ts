import { app, BrowserWindow, Menu, ipcMain, shell } from "electron";
import * as path from "path";
import * as resizeimg from "resize-img"
import * as fs from "node:fs"
import { homedir } from "os";

const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV !== 'production';


let mainWindow: BrowserWindow | null;
let aboutWindow;

console.log(__dirname)
function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    width: 300,
    height: 300,
    title: 'About Electron',
  });

  aboutWindow.loadFile(path.join(__dirname, "../renderer/about.html"));
}

const template = [
  {
    label: "about",
    click: createAboutWindow
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      }
    ]
  },

  {
    label: 'View',
    submenu: [
      {
        role: 'reload'
      },
      {
        role: 'toggledevtools'
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },

  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },

  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More'
      }
    ]
  }
]


function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preeload.js"),
      sandbox: false,
    },
    width: 1000,

  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));

}

ipcMain.on('image:resize', (e, options) => {
  console.log(options)
  let destination = path.join(homedir(), "imageresizer") 
  resizeImage({ imgPath: options.imagePath, height: options.height, width: options.width, dest: destination})

})

async function resizeImage({ imgPath, height, width, dest }: { imgPath: string; height: string; width: string; dest: string }) {
  try {
    // console.log(imgPath, height, width, dest);

    // Resize image
    const newPath = await resizeimg(fs.readFileSync(imgPath), {
      width: +width,
      height: +height,
    });

    // Get filename
    const filename = path.basename(imgPath);

    // Create destination folder if it doesn't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    // Write the file to the destination folder
    fs.writeFileSync(path.join(dest, filename), newPath);

    // Send success to renderer
    mainWindow.webContents.send('image:done');

    // Open the folder in the file explorer
    shell.openPath(dest);
  } catch (err) {
    console.log(err);
  }

}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();


  app.on("activate", function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

//@ts-ignore
const mainMenu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(mainMenu)
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
