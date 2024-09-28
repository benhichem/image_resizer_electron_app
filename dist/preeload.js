"use strict";
// const { contextBridge } = require('electron')
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var Tostify = require("toastify-js");
var node_os_1 = require("node:os");
electron_1.contextBridge.exposeInMainWorld('path', {
    join: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return path.join.apply(path, args);
    }
});
electron_1.contextBridge.exposeInMainWorld('versions', {
    node: function () { return process.versions.node; },
    chrome: function () { return process.versions.chrome; },
    electron: function () { return process.versions.electron; }
    // we can also expose variables, not just functions
});
electron_1.contextBridge.exposeInMainWorld('os', {
    homedir: (0, node_os_1.homedir)()
});
electron_1.contextBridge.exposeInMainWorld('tosty', {
    toast: function (options) { return Tostify(options).showToast(); }
});
electron_1.contextBridge.exposeInMainWorld('ipcRenderer', {
    send: function (chanel, message) { return electron_1.ipcRenderer.send(chanel, message); },
    on: function (chanel, func) { return electron_1.ipcRenderer.on(chanel, func); }
});
//# sourceMappingURL=preeload.js.map