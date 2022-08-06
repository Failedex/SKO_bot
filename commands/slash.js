const {ApplicationCommandOptionType} = require("discord.js");

module.exports = {
    description: "Delete slash commands",
    category: "Configuration",
    usage: "<command name or id>",
    options: [{
        name: "command",
        description: "command to delete",
        required: true,
        type: ApplicationCommandOptionType.String
    }],

    execute: async ({interaction}) => {
        const guild = interaction.guild;

        const arg = interaction.options.getString("command");

        if (arg === "slash") {
            interaction.reply("You can't do that :(");
            return
        }
        
        const command = guild.commands.cache.find(c => c.id === arg || c.name === arg);

        if (!command) {
            interaction.reply("Slash command not found");
            return
        }

        await command.delete()
        await interaction.reply("slahs command removed for this guild");
    }
}
