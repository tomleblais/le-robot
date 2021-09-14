const { regex } = require("french-badwords-list")

module.exports = {
    name: "badwords",
    disabled: false,
    filter: regex,
    description: "Surveille les b4dw0rd5",
    execute: (client, msg) => {
        const replies = [
            "surveille ton langage wesh",
            "ça va pas de parler comme ça",
            "utilise pas des mots comme ça d'vant moi",
            "des fois j'me demande qui t'a éduqué",
            "parle mieux, on verra après",
            "oh sur un autre ton stp",
            "comment il parle lui",
            "tu parles comme ça chez toi ? nan ? alors ici c'est pareil",
            "j't'ai pas éduqué comme ça moi",
            "moi le (ba)bac est derrière moi donc parle mieux"
        ]
        let randomIndice = Math.round(Math.random() * replies.length) - 1
        msg.channel.send(replies[randomIndice])
            .catch(console.error)
    }
}