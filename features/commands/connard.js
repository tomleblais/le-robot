const db = require("electron-db")
const path = require("path")

const Util = require("../../lib/util")
const { CommandError, ArgumentCommandError } = require("../../lib/errors")

const location = path.join(__dirname, "../../stats/")

module.exports = {
    name: "connard",
    disabled: false,
    permission: "everyone",
    channelType: ["GUILD_TEXT", "DM"],
    usage: "connard <@mention>",
    description: "Vote pour le connard du jour",
    execute: (client, msg, args) => {
        // Vérifie si le serveur en question possède un salon nommé "le-robot"
        const channel = msg.guild.channels.cache.filter((channel) => channel.name === "le-robot").first()
        if (!channel)
            return

        var hasAlreadyVoted = false
        const now = new Date()
        const when = {
            days: [1, 2, 3, 4, 5, 0],
            hours: [19, 20]
        }
        // Vérifie si il est l'heure d'utiliser la commande
        if (!Util.isItTime(when, now))
            return Util.report(msg, new CommandError("tu peux pas utiliser cette commande, attends 21h"))
        
        // Vérifie si le membre a spécifié un membre
        const member = Util.getMemberFromMention(args[0], msg)
        if (!member)
            return Util.report(msg, new ArgumentCommandError("tu dois renseigner une mention qui désigne un membre du serveur"))
        
        // Vérifie si le membre a spécifié un membre bot
        if (member.user.bot)
            return Util.report(msg, new ArgumentCommandError("tu peux pas dire qu'un bot est un connard, occupe-toi de ta race déjà"))
            
        const monthYear = `${now.getFullYear()}-${now.getMonth()}`
        const step = now.getDay() != 6 ? 1 : 2

        // Vote
        db.getRows("connards", location, { guildId: msg.guildId, userId: msg.member.user.id }, (succ, rows) => {
            if (!succ)
                return console.log(rows)

            if (rows.length == 0) { // Si le membre n'est pas dans la table
                db.insertTableContent("connards", location, {
                    guildId: msg.guildId,
                    userId: msg.member.user.id,
                    hasVoted: true,
                    scores: []
                }, (succ, msg) => {
                    if (!succ)
                        console.log(msg)
                })
            } else { // Si le membre est dans la table
                const row = rows[0]
                if (!row.hasVoted) { // Si le membre n'a pas déjà voté
                    db.updateRow("connards", location, { id: row.id }, { hasVoted: true }, (succ, msg) => {
                        if (!succ)
                            console.log(msg)
                    })
                } else 
                    hasAlreadyVoted = true
            }
        })
        if (!hasAlreadyVoted) { // Si le membre vote pour la première fois aujourd'hui
            // Add points
            db.getRows("connards", location, { guildId: msg.guildId, userId: member.user.id }, (succ, rows) => {
                if (!succ)
                    return console.log(rows)
    
                if (rows.length == 0) { // Si le membre mentionné n'est pas dans la table
                    db.insertTableContent("connards", location, {
                        guildId: msg.guildId,
                        userId: member.user.id,
                        hasVoted: false,
                        scores: [
                            {
                                date: monthYear,
                                points: step
                            }
                        ]
                    }, (succ, msg) => {
                        if (!succ)
                            console.log(msg)
                    })
                } else { // Si le membre mentionné est dans la table
                    const row = rows[0]
                    const scores = row.scores
                    let score = scores.filter(score => score.date == monthYear)
                    if (score.length > 0) // Si le membre mentionné a un score du mois non-nul
                        scores.filter(score => score.date == monthYear)[0].points += step
                    else // Si le membre mentionné a un score du mois nul
                        scores.push({ date: monthYear, points: step })
                    db.updateRow("connards", location, { id: row.id }, {
                        scores: scores
                    }, (succ, msg) => {
                        if (!succ)
                            console.log(msg)
                    })
                }
                Util.report(msg, "ton vote a bien été pris en compte")
            })
        } else
            return Util.report(msg, "mec t'as déjà voté")
    }
}