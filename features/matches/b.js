module.exports = {
    name: "b",
    disabled: false,
    filter: /\b(a+h+|h+a+)+ *[!-/:-?{-~]*$/i,
    description: "Répond \"b\" lorsqu'un utilisateur envoie un message finissant par \"ah\"",
    execute: (client, msg) => {
        msg.channel.send("b")
    }
}