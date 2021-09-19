module.exports = {
    name: "deux",
    disabled: false,
    filter: /h?(e|a)in *[!-/:-?{-~]*$/i,
    description: "Répond \"deux\" lorsqu'un utilisateur envoie un message finissant par \"hein\"",
    execute: (client, msg) => {
        msg.channel.send("deux")
    }
}