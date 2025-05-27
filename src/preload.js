const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electron", {
    MinmizarJanela: () => {ipcRenderer.send("minimizar")},
    MaximizarJanela: () => {ipcRenderer.send("maximizar")},
    FecharJanela: () => {ipcRenderer.send("fechar")},

    CriarChat: (NomeChatC) => {
        ipcRenderer.send("CriarChat", NomeChatC)
    },
    AbrirChat: (codigo) => {
        ipcRenderer.send("AbrirChat", codigo)
    },
    EnviarMsg: (mensagem) => {
        ipcRenderer.send("EnviarMsg", mensagem)
    },
    ExibirChat: (NomeChatE) => {
        return ipcRenderer.invoke("ExibirChat", NomeChatE)
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