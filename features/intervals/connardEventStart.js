const db = require("electron-db")
const path = require("path")

const { color } = require("../../config.json")

// Création des tables de données
const location = path.join(__dirname, "../../stats/")
if (!db.tableExists("connards", location)) {
	db.createTable("connards", location, (succ, msg) => {
		if (!succ)
			console.log(msg)
	})
}

module.exports = {
    name: "connardEventStart",
    disabled: false,
    when: {
        days: [1, 2, 3, 4, 5, 0],
        hours: 19,
        minutes: 0
    },
    execute: (client) => {
        db.getAll("connards", location, (succ, rows) => {
            rows.forEach(row => {  
                db.updateRow("connards", location, {
                    id: row.id
                }, { hasVoted: false }, (succ, data) => {
                    if (!succ)
                        console.log(data)
                })
            })
        })
        client.guilds.cache.each(guild => {
            const channel = guild.channels.cache.filter(channel => channel.name === "le-robot").first()
            if (!channel)
                return

            channel.send({
                embeds: [
                    {
                        color: color,
                        title: "Qui est le connard du jour ?",
                        description: "Utilisez `!connard @mention` pour voter quelqu'un"
                    }
                ]
            })
        })
    }
}