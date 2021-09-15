const CommandError = require("./CommandError")

class ArgumentCommandError extends CommandError {
    constructor(...params) {
        super(...params)

        this.name = "ArgumentCommandError"
        this.description = "Erreur d'argument de commande"
    }
}

module.exports = ArgumentCommandError