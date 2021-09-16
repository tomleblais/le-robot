const { Client, Intents, Collection } = require('discord.js')
const db = require("electron-db")

const path = require("path")
const fs = require("fs")

const Util = require("./lib/util")
const { PermissionCommandError } = require("./lib/errors")

const { prefix, token } = require('./config.json')

// Création d'une nouvelle instance client
const client = new Client({ intents: [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.DIRECT_MESSAGES
]})

client.features = new Map()

// Quand le client est prêt ...
client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag}`)
	// Initialisation des features
	const featuresFolders = fs.readdirSync("./features/").filter((file) => !file.includes("."))
	for (const featureName of featuresFolders) {
		client.features.set(featureName, new Collection())
		const files = fs.readdirSync(`./features/${featureName}`).filter((file) => file.includes("."))

		for (const fileName of files) {
			const feature = require(`./features/${featureName}/${fileName}`)
			client.features.get(featureName).set(feature.name, feature)
		}
	}
	// Interval features
	setInterval(() => {
		client.features.get("intervals").each((interval) => {
			if (!interval.disabled) {
				if (Util.isItTime(interval.when)) {
					try {
						interval.execute(client)
					} catch (err) {
						console.error(err)
					}
				}
			}
		})
	}, 60000) // Correspond à une minute (60,000 milisec)
})

// Quand un message est envoyé ...
client.on("messageCreate", (msg) => {
	if (msg.author.id == client.user.id)
		return
	// Command features
	if (msg.content.trim().startsWith(prefix)) {
		const args = msg.content.slice(prefix.length).trim().split(/ +/)
        const commandName = args.shift().toLowerCase()
    
        const command = client.features.get("commands").get(commandName)
                     || client.features.get("commands").find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

        if (command) {
			try {
				if (command.channelType && !command.channelType.some(value => value === msg.channel.type)) // Vérifie si la commande permet d'être utilisée dans ce salon
					throw new PermissionCommandError("Vous ne pouvez pas exécuter cette commande dans ce salon")
				
				if (msg.channel.type !== "dm") { // Vérifie si le message est envoyé dans le salon d'un serveur
					if (command.permission === "admin" && !msg.member.hasPermission("ADMINISTRATOR")) // Vérifie si la commande permet d'être seulement utilisée par les admin et si l'utilisateur est un admin
						throw new PermissionCommandError("Vous devez avoir les droits administrateurs pour exécuter cette commande")
				}
				
				if (!command.disabled)
					command.execute(client, msg, args)
			} catch (err) {
				Util.report(msg, err)
			}
			return
		}
	}
	// Match features
	client.features.get("matches").each((match) => {
		if (match.filter && msg.content.match(match.filter)) {
			if (!match.disabled) {
				try {
					match.execute(client, msg)
				} catch (err) {
					console.error(err)
				}
			}
		}
	})
})

// Connexion à Discord avec le token
client.login(token)
