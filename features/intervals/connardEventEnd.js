const { color } = require("../../config.json")

module.exports = {
    name: "connardEventEnd",
    disabled: false,
    when: {
        days: [1, 2, 3, 4, 5, 0],
        hours: 21,
        minutes: 0
    },
    execute: (client) => {
        client.guilds.cache.each(guild => {
            const channel = guild.channels.cache.filter(channel => channel.name === "le-robot").first()
            if (!channel)
                return

            channel.send({
                embeds: [
                    {
                        color: color,
                        title: "Votes terminés !",
                        description: "Tous les votes ont sûrment bien été pris en compte"
                    }
                ]
            })
        })
    }
}