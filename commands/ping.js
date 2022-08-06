const {EmbedBuilder} = require("discord.js")

module.exports = {
    // these 3 are compulsory
    description: 'pong!',
    category: 'Configuration',

    // whether it should be seen by the help command
    hidden: false,

    execute: async ({client, interaction}) => {
        const embed = new EmbedBuilder()
        .setTitle("pong")
        .setColor(client.colour)
        .setDescription(`Latency is **${Date.now() - interaction.createdTimestamp}ms.**`)

        await interaction.reply({embeds: [embed]});
    }
}
