const {EmbedBuilder} = require("discord.js")

module.exports = {
    // these 3 are compulsory
    name: 'ping',
    description: 'pong!',
    category: 'General',

    // will work on later
    hidden: false,
    // not required but there if you want
    minArgs: 0,
    maxArgs: 0,
    
    execute: async (client, message, args) => {
        const embed = new EmbedBuilder()
        .setTitle("pong")
        .setColor(client.colour)
        .setDescription(`Latency is **${Date.now() - message.createdTimestamp}ms.**`)

        await message.reply({embeds: [embed]});
    }
}