const {ApplicationCommandOptionType, PermissionsBitField} = require("discord.js");

module.exports = {
    description: "warns a member", 
    category: "Configuration",
    usage: "<channel>",
    options: [{
        name: "channel",
        description: "channel for the greeting message",
        required: true,
        type: ApplicationCommandOptionType.Channel
    }],

    execute: async ({interaction}) => {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.reply("You don't have permission to do this");
            return
        }

        const channel = await interaction.options.getChannel("channel");
    
        if (!channel) {
            await interaction.reply("invalid channel");
            return
        }


    }
}