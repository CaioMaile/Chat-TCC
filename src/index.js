const { app, BrowserWindow, ipcMain } = require("electron")
const { join } = require("path")
const axios = require("axios")

app.whenReady()
    .then (() => {
        const user = axios.create({baseURL: "http://200.100.0.14/api/v1/user"})
        const session = axios.create({baseURL: "http://200.100.0.14/api/v1/session"})

        const lembrarNome = ""

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
        janela.loadFile( join(__dirname, "./public/PaginaLogin.html"))
        
        ipcMain.on("maximizar", () => {
            janela.isMaximized() ? janela.unmaximize() : janela.maximize()
        })
        ipcMain.on("minimizar", () => {
            janela.minimize()
        })
        ipcMain.on("fechar", () => {
            app.quit()
        })
        ipcMain.on("CriarUsuario", (event, nome, senha) => {
            user.post("/create", {
                "data": { 
                    "user": {
                        "username": nome,
                        "password": senha
                    }
                }
            })

            janela.loadFile( join(__dirname, "./public/PaginaLogin.html"))
        })
        ipcMain.on("LogarUsuario", (event, nome, senha) => {
            session.post("/create", {
                "data": {
                    "user": {
                        "username": nome,
                        "password": senha
                    }
                }
            }).then((response) => {
                console.log( response.status)
                console.log(response.data)
                janela.loadFile(join(__dirname, "./public/PaginaPrincipal.html"))
            }).catch(console.log('erro no encontro de usuario'))
        })
        ipcMain.on("AbrirChat", () => {
            const username = axios.get('')
            const server = axios.get('')
            janela.loadFile(join(__dirname, "./public/Chat.html"))
        })
        ipcMain.on("MudarPagina", (Event, irPra) => {
            if (irPra == "Login"){janela.loadFile("./public/PaginaLogin.html")}
            else if (irPra == "Singin"){janela.loadFile("./public/PaginaSingin.html")}
        })
        app.on("will-quit", (event) => {session.delete("/destroy", {
            "data": {
                "user": {
                    "username": "Caio"
                }
            },
            "session": {
                "acess_token":"1685615042025211215"
            }
        })})
    })