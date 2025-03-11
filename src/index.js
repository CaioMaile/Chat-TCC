const { app, BrowserWindow, ipcMain } = require("electron")
const { join } = require("path")
import axios from 'axios'
const api = axios.create({ baseURL: 'http://200100015/api'})

app.whenReady()
    .then (() => {
        let username = ''

        const janela = new BrowserWindow ({
            autoHideMenuBa: true,
            minHeight: 580,
            icon: join(__dirname, "./public/icon.png"),
            frame: false,
            title: "Chat",
            minWidth: 920,
            webPreferences: {
                preload: join(__dirname, "preload.js")
            }       
        })
        janela.loadFile( join(__dirname, "./public/PaginaPrincipal.html"))

        ipcMain.on("maximizar", () => {
            janela.isMaximized() ? janela.unmaximize() : janela.maximize()
        })
        ipcMain.on("minimizar", () => {
            janela.minimize()
        })
        ipcMain.on("fechar", () => {
            app.quit()
        })
        ipcMain.on("CriarUsuario", () => {
            const nome = api.
        })
        ipcMain.on("AbrirChat", () => {
            const username = api.get('')
            const server = api.get('')
            janela.loadFile(join(__dirname, "./public/Chat.html"))
        })
    })