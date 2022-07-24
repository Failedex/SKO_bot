
module.exports = {
    description: "Delete slash commands",
    category: "Configuration",
    slash: false,
    minArgs: 1,
    maxArgs: 1,

    execute: async ({message, args}) => {
        const guild = message.guild;
        const command = guild.commands.cache.find(c => c.id === args[0] || c.name === args[0]);

        if (!command) {
            message.reply("Slash command not found");
            return
        }

        await command.delete()
        await message.reply("slahs command removed for this guild");
    }
}