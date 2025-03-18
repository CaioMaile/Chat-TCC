const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electron", {
    MinmizarJanela: () => {ipcRenderer.send("minimizar")},
    MaximizarJanela: () => {ipcRenderer.send("maximizar")},
    FecharJanela: () => {ipcRenderer.send("fechar")},

    AbrirChat: (codigo) => {
        ipcRenderer.send("Abrir Chat", codigo)
    },
    CriarUsuario: (nome, senha) => {
        alert(nome)
        ipcRenderer.send("CriarUsuario", nome, senha)
    }
})