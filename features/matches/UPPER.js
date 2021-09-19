const strings = require("../../static/strings.json")

module.exports = {
    name: "UPPER",
    disabled: false,
    filter: /.+/,
    description: "Impose le calme quand quelqu'un parle trop fort",
    execute: (client, msg) => {
        const raw = msg.content.replace(/[^a-z]/ig, "")
		if (raw.length >= 3 && raw == raw.toUpperCase()) {
            const replies = strings.features.matches.UPPER.replies
            let randomIndice = Math.round(Math.random() * replies.length - 1)
            msg.channel.send(replies[randomIndice])
                .catch(console.error)
        }
    }
}