const { prefix, color } = require("../../config.json")

module.exports = {
    name: "help",
    disabled: false,
    permission: "everyone",
    channelType: ["GUILD_TEXT", "DM"],
    aliases: ["info"],
    usage: `help`,
    description: `Affiche les informations de toutes les commandes`,
    execute: (client, msg, args) => {

        const fields = []
        client.features.get("commands").each((command) => {
            fields.push({
                name: `La commande \`${command.name}\`${command.aliases ? ` (ou \`${command.aliases.join("\` ou \`")}\`)` : ""}`,
                value: `${command.description} ${command.permission === "admin" ? `(administrateur seulement)` : ""}`.trim(),
                inline: false
            })
        })
        msg.channel.send({
            embeds: [
                {
                    color: color,
                    title: "Fiche d'aide",
                    fields: fields
                }
            ]
        })
    }
}