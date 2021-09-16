const db = require("electron-db")
const path = require("path")

const Util = require("../../lib/util")

const { color } = require("../../config.json")
const location = path.join(__dirname, "../../stats/")

module.exports = {
    name: "connardEventRanking",
    disabled: false,
    when: {
        hours: 21,
        minutes: 1,
        date: 0
    },
    execute: (client) => {

        const now = new Date()
        const monthYear = `${now.getFullYear()}-${now.getMonth()}`

        client.guilds.cache.each(guild => {

            const channel = guild.channels.cache.filter(channel => channel.name === "le-robot").first()
            if (!channel)
                return

            const rank = []
            db.getRows("connards", location, { guildId: guild.id}, (succ, rows) => {
                rows.forEach(row => {
                    score = row.scores.filter(score => score.date == monthYear)
                    if (score.length) {
                        rank.push({
                            userId: row.userId,
                            points: score.length > 0 ? score[0].points : 0
                        })
                    }
                })
            })

            rank.sort((a, b) => {
                b.points - a.points
            })

            var description = []
            rank.forEach((score, i) => {
                description.push(`${Util.numberToEmote(i + 1)} <@!${score.userId}> avec **${score.points} point${score.points > 1 ? "s" : ""}**`)
            })

            if (description.length > 0) {
                channel.send({
                    embeds: [
                        {
                            color: color,
                            title: "Classement des plus gros connards du mois",
                            description: description.join("\n")
                        }
                    ]
                })
            }
        })
    }
}