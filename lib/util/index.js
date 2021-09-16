const DIGITS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]

const Util = {
    getMembersFromMention: (mention, msg) => {
        if (!mention)
            return []

        let members = []

        if (mention.startsWith("<@") && mention.endsWith(">")) {
            mention = mention.slice(2, -1)

            if (mention.startsWith("!") || mention.startsWith("&"))
                mention = mention.slice(1)

            if (msg.guild.members.cache.has(mention))
                members.push(msg.guild.members.cache.get(mention))
            else if (msg.guild.roles.cache.has(mention))
                members = msg.guild.roles.cache.get(mention).members.array()

        } else if (mention === "@everyone")
            members = members.concat(msg.guild.members.cache.array())

        return members
    },
    getMemberFromMention: (mention, msg) => {
        if (!mention)
            return null

        let member = false

        if (mention.startsWith("<@") && mention.endsWith(">")) {
            mention = mention.slice(2, -1)

            if (mention.startsWith("&"))
                return 0

            if (mention.startsWith("!"))
                mention = mention.slice(1)

            if (msg.guild.members.cache.has(mention))
                member = msg.guild.members.cache.get(mention)
        }
        return member
    },
    isItTime: (when) => {
        if (when == undefined)
            return true

        let now = new Date()
        // Date
        if (!Util.matchedTime(when.days,   now.getDay()))      { return false }
        if (!Util.matchedTime(when.dates,  now.getDate()))     { return false }
        if (!Util.matchedTime(when.months, now.getMonth()))    { return false }
        if (!Util.matchedTime(when.years,  now.getFullYear())) { return false }
        // Time
        if (!Util.matchedTime(when.minutes, now.getMinutes())) { return false }
        if (!Util.matchedTime(when.hours,   now.getHours()))   { return false }

        return true
    },
    matchedTime: (when, now) => {
        if (when == undefined)
            return true

        if (typeof when === "number")
            return when == now
        else if (when instanceof Array)
            return when.includes(now)
    },
    report: (msg, data) => {
        if (data instanceof Error)
            return msg.channel.send(`${data.emote || ":x:"} **${data.description || "Erreur interne"} :** ${data.message}`)
        return msg.channel.send(data)
    },
    numberToEmote(n) {
        out = []
        for (const digit of String(n)) {
            out.push(`:${DIGITS[Number(digit)]}:`)
        }
        return out.join("")
    }
}

module.exports = Util