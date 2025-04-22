const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electron", {
    MinmizarJanela: () => {ipcRenderer.send("minimizar")},
    MaximizarJanela: () => {ipcRenderer.send("maximizar")},
    FecharJanela: () => {ipcRenderer.send("fechar")},

    AbrirChat: (codigo) => {
        ipcRenderer.send("Abrir Chat", codigo)
    },
    CriarUsuario: (nome, senha) => {
        ipcRenderer.send("CriarUsuario", nome, senha)
    },
    LogarUsuario: (nome, senha) => {
        ipcRenderer.send("LogarUsuario", nome, senha)
    },
    MudarPagina: (irPra) => {
        ipcRenderer.send("MudarPagina", irPra)
    },
    Deslogar: (a) => {
        ipcRenderer.send("Deslogar", a)
    }
})