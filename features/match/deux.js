module.exports = {
    name: "deux",
    disabled: false,
    filter: /hein *[!-/]*[:-?]*[{-~]*$/,
    description: "Répond \"deux\" lorsqu'un utilisateur envoie un message finissant par \"hein\"",
    execute: (client, msg) => {
        msg.channel.send("deux")
    }
}