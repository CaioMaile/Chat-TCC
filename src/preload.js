const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electron", {
    MinmizarJanela: () => {ipcRenderer.send("minimizar")},
    MaximizarJanela: () => {ipcRenderer.send("maximizar")},
    FecharJanela: () => {ipcRenderer.send("fechar")},

    AbrirChat: (nome, codigo) => {
        ipcRenderer.send("Abrir Papo", nome, codigo)
    },
    CriarUsuario: (nome, senha) => {
        ipcRenderer.send("CriarUsuario", nome, senha)
    }
})