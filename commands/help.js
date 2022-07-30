const { EmbedBuilder } = require("@discordjs/builders")

module.exports = {
    description: "Give info about command or view all command",
    category: "help",
    slash: true,
    maxArgs: 1,
    usage: "[command]",
    
    execute: async ({client, message, interaction, args}) => {

        if (args[0]){
            const command = client.commands.get(args[0]);
            
            const embed = new EmbedBuilder()
            .setColor(client.colour)
            .setTitle("Help")

            if (!command) {
                embed.setDescription("Command not found.")
                message.reply({embeds: [embed]})
                return 
            }

            embed.setDescription(`**${args[0]}** -- ${command.description} \naliases: ${command.aliases? command.aliases.join(", "): ""} \nsyntax: \`${client.prefix}${args[0]} ${command.usage !== undefined?command.usage:""}\``);

            await message.reply({embeds: [embed]});

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