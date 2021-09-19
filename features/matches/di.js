module.exports = {
    name: "di",
    disabled: false,
    filter: /di/i,
    description: "Répond on demande de dire quelque chose",
    execute: (client, msg) => {
		const words = msg.content.trim().split(/( |-)+/).filter(word => word.length > 2)
        var reply = ""
        for (const word of words) {
            let i = word.search(/di/i)
            if (i >= 0) {
                let rest = word.slice(i + 2)
                if (rest.length > 1) {
                    reply = rest
                    break
                }
            } 
        }
        if (reply.length > 0) {
            msg.channel.send(reply.toLowerCase())
                .catch(console.error)
        }
    }
}