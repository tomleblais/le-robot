module.exports = {
    name: "ffeur",
    disabled: false,
    filter: /(qu|k|c)(oi|oa|oua|wa) *[!-/]*[:-?]*[{-~]*$/,
    description: "Répond \"ffeur\" lorsqu'un utilisateur envoie un message finissant par \"quoi\"",
    execute: (client, msg) => {
        msg.channel.send("ffeur")
    }
}