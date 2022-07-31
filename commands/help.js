const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js")

module.exports = {
    description: "Give info about command or view all command",
    category: "help",
    slash: true,
    maxArgs: 1,
    usage: "[command]",
    options: [{
        name: "command",
        description: "command to check info on", 
        required: false,
        type: ApplicationCommandOptionType.String
    }],
    
    execute: async ({client, message, interaction, args}) => {

        const arg = message? args[0]: interaction.options.getString('command');

        if (arg){
            const command = client.commands.get(arg);
            
            const embed = new EmbedBuilder()
            .setColor(client.colour)
            .setTitle("Help")

            if (!command) {
                embed.setDescription("Command not found.")
                message.reply({embeds: [embed]})
                return 
            }

            embed.setDescription(`**${arg}** -- ${command.description} \naliases: ${command.aliases? command.aliases.join(", "): ""} \nsyntax: \`${client.prefix}${arg} ${command.usage !== undefined?command.usage:""}\``);

            if (message) {
                await message.reply({embeds: [embed]});
            } else {
                await interaction.reply({embeds: [embed]});
            }

        } else {
            const embed = new EmbedBuilder()
            .setColor(client.colour)
            .setTitle("Help")
            .setThumbnail(client.user.avatarURL())
            .setDescription(`use \`${client.prefix}help <command>\` to view more information about a command`);

            const categories = {};
            for (const command of client.commands) {
                if (command[1].hidden) continue
                if (categories[command[1].category]) {
                    categories[command[1].category].push(command[0]);
                } else {
                    categories[command[1].category] = [command[0]];
                }
            }

            for (const [category, commands] of Object.entries(categories)) {
                embed.addFields({name: category, value: commands.join(" | ")});
            }

            if (message) {
                await message.reply({embeds: [embed]});
            } else {
                await interaction.reply({embeds: [embed]});
            }
        }
    }
}