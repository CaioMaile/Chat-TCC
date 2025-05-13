const { app, BrowserWindow, ipcMain, session } = require("electron")
const { join } = require("path")
const axios = require("axios")
const { access } = require("fs")
const { url } = require("inspector")
const { error } = require("console")

app.whenReady()
    .then (() => {
        const user = axios.create({baseURL: "http://localhost:3000/api/v1/user"})
        const sessionRota = axios.create({baseURL: "http://localhost:3000/api/v1/session"})

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
        
        const sessao =  session.defaultSession.cookies 

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
                    url: 'http://descent.com',
                    username: `${response.data.data.username}`, 
                    access_token: `${response.data.data.access_token}`
                }
                
                session.defaultSession.cookies.set({
                    url: 'http://descent.com', 
                    name: 'username', 
                    value: cookie.username
                })
                session.defaultSession.cookies.set({
                    url: 'http://descent.com', 
                    name: 'acess_token',
                    value: cookie.access_token
                })

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
            sessao.get({url: 'http://descent.com'})
            .then((cookies) => {
                username = cookies.filter(cookies => cookies.name == 'username')[0].value
                token = cookies.filter(cookies => cookies.name == 'acess_token')[0].value
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
                        console.log(cookies)
                    })
                })})
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