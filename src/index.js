const { app, BrowserWindow, ipcMain, session } = require("electron")
const { join } = require("path")
const axios = require("axios")
const { access } = require("fs")
const { url } = require("inspector")

app.whenReady()
    .then (() => {
        const user = axios.create({baseURL: "http://200.100.10/api/v1/user"})
        const sessionRota = axios.create({baseURL: "http://200.100.0.10/api/v1/session"})

        const cookie = { url: 'https://www.github.com', name: 'Usuario' }

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
            sessionRota.post("/create", {
                "data": {
                    "user": {
                        "username": nome,
                        "password": senha
                    }
                }
            }).then((response) => {
                console.log( response.status)
                console.log(response.data.data)
                
                const cookie = { 
                    url: 'http://www.descent.com',
                    username: `${response.data.data.username}`, 
                    access_token: `${response.data.data.access_token}`
                }
                console.log(cookie)
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
        ipcMain.on("Deslogar", (event, a) => {
            const c = cookie.get()
            const username = c.username
            const token = c.access_token
            sessionRota.delete("/destroy", {
                params: {
                    "data": {
                        "user": {
                            "username": username
                        },
                        "session": {
                            "access_token": token
                        }                
                    }
                }
            }).catch( (error) => {
                console.log(error)
                console.log(username, 'e', token)
            }
        )})
        app.on("will-quit", (event) => {
            console.log("cookie")
            // sessionRota.delete("/destroy", {
            //     "data": {
            //         "user": {
            //             "username": 
            //         }
            //     },
            //     "session": {
            //         "acess_token":"1685615042025211215"
            //     }
            // }
            // )
        })
    })