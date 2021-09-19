const { regex } = require("french-badwords-list")
const strings = require("../../static/strings.json")

module.exports = {
    name: "badwords",
    disabled: false,
    filter: regex,
    description: "Surveille les b4dw0rd5",
    execute: (client, msg) => {
        const replies = strings.features.matches.badwords.replies
        let randomIndice = Math.round(Math.random() * replies.length - 1)
        msg.channel.send(replies[randomIndice])
            .catch(console.error)
    }
}