const { app, BrowserWindow, ipcMain } = require("electron")
const { join } = require("path")
const axios = require("axios")


app.whenReady()
    .then (() => {
        let usuario = ''
        let snh = ''

        const user = axios.create({baseURL: "http://127.0.0.1:3000/api/v1/user"})
        const session = axios.create({baseURL: "http://127.0.0.1:3000//api/v1/session"})

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
        janela.loadFile( join(__dirname, "./public/PaginaSingin.html"))

        ipcMain.on("maximizar", () => {
            janela.isMaximized() ? janela.unmaximize() : janela.maximize()
        })
        ipcMain.on("minimizar", () => {
            janela.minimize()
        })
        ipcMain.on("fechar", () => {
            app.quit()
        })
        ipcMain.on("CriarUsuario", (nome, senha) => {
            usuario = nome
            snh = senha
            user.post("/create", {
                "username": usuario,
                "password": snh,
            })
            console.log
            janela.loadFile(join(__dirname, "./public/Chat.html"))
        })
        ipcMain.on("AbrirChat", () => {
            const username = axios.get('')
            const server = axios.get('')
            janela.loadFile(join(__dirname, "./public/Chat.html"))
        })
    })