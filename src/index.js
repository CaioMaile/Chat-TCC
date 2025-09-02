const { app, BrowserWindow, ipcMain, session } = require("electron")
const { join } = require("path")
const axios = require("axios")
const { access } = require("fs")
const { url } = require("inspector")
const { error } = require("console")
const { electron } = require("process")

app.whenReady()
    .then (() => {
        const ipSession = "http://200.100.0.20"
        const sessionRota = axios.create({baseURL: `${ipSession}/api/v1/session`})
        const Chat = axios.create({baseURL: `${ipSession}/api/v1/chat`})
        const user = axios.create({baseURL: `${ipSession}/api/v1/user`})

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
        janela.webContents.openDevTools();

        
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
                    value: cookie.username,
                })
                session.defaultSession.cookies.set({
                    url: 'http://descent.com', 
                    name: 'acess_token',
                    value: cookie.access_token,
                })

                janela.loadFile(join(__dirname, "./public/PaginaPrincipal.html"))
            }).catch(console.log('erro no encontro de usuario'))
        })
        ipcMain.on("CriarChat", (event, NomeChatC) => {
            console.log(NomeChatC)
            sessao.get({url: 'http://descent.com'})
            .then((cookies) => {
                username = cookies.filter(cookies => cookies.name == 'username')[0].value
                token = cookies.filter(cookies => cookies.name == 'acess_token')[0].value
                const date = new Date()
                Chat.post("/send_content", {
                "data":{
                    "session":{
                        "username": username,
                        "access_token": token
                    },
                    "message" : {
                        "chat": NomeChatC,
                        "content": date.toLocaleDateString()
                    }
                }
                }).then(() => {session.defaultSession.cookies.set({url: 'http://descent.com', name: 'Chat',value: NomeChatC})}).catch((error) => {console.log(error), console.log(date.toLocaleDateString())})
            })
            janela.loadFile("./public/Chat.html")
        })
        ipcMain.on("AbrirChat", () => {

        })
        ipcMain.on("EnviarMsg", async (event, mensagem) => {
            sessao.get({url: 'http://descent.com'})
            .then((cookies) => {
                username = cookies.filter(cookies => cookies.name == 'username')[0].value
                token = cookies.filter(cookies => cookies.name == 'acess_token')[0].value
                namechat = cookies.filter(cookies => cookies.name == 'Chat')[0].value
                Chat.post("/send_content", {
                "data":{
                    "session":{
                        "username": username,
                        "access_token": token
                    },
                    "message" : {
                        "chat": namechat,
                        "content": mensagem
                    }
                }
                }).then((response) => {console.log("certo", mensagems, namechat)}).catch((error) => {console.log("errado", mensagem.content, mensagem.chat)})
            })
        })
        let result = { 'messages' : [] }
        ipcMain.handle( "ExibirChat", async (event) => {
            sessao.get({url: 'http://descent.com'})
                .then((cookies) => {
                    username = cookies.filter(cookies => cookies.name == 'username')[0].value
                    token = cookies.filter(cookies => cookies.name == 'acess_token')[0].value
                    namechat = cookies.filter(cookies => cookies.name == 'Chat')[0].value           
                    //  const mensagens = 
                    Chat.get("/receive_content", {
                        params: {
                        "data":{
                            "session":{
                                "username": username,
                                "access_token": token
                            },
                            "message":{
                                "chat": namechat
                            }
                        }
                        }
                    }).then((response) => {
                        // console.log('START -> ', response.data[0], "-> END")
                        //result['messages'] = response.data]
                        //console.log(response.data[2])
                        //console.log("PRIMEIRO")
                        result['messages'] = response.data
                        // return response
                    }).catch((error) => {
                        console.log(error)
                    })
                })
            //console.log(result)
            //console.log("AQUI")
            return result
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
                    },
                    }),janela.loadFile("./public/PaginaLogin.html").catch( (error) => {
                        console.log(error)
                        console.log(username, 'e', token)
                        console.log(cookies)
                    })
                })})
        app.on("will-quit", (event) => {
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
                    },
                    }),janela.loadFile("./public/PaginaLogin.html").catch( (error) => {
                        console.log(error)
                        console.log(username, 'e', token)
                        console.log(cookies)
                    })
                }) 
        })
})