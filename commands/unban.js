module.exports = {
    description: "unban a member",
    catergory: "Moderation",
    slash: true,
    minArgs: 1,
    usage: "<member> [reason]",
    
    execute: async ({client, message, interaction, args}) => {
        if (message) {
            const tag = args.shift();
            
            const member_id = tag.replace("<@!", "").replace(">", "");

            const reason = args.join(" ");

            const member = await message.guild.bans.fetch(member_id);

            if (!member) {
                await message.reply("Couldn't find banned member");
                return
            }

            message.guild.unban(member_id, `Unbanned by ${message.author.username} \nReason: ${reason}`).then(()=>{
                message.reply(`Unbanned <@${member_id}>`)
            }).catch(()=>{
                message.reply("Unable to unban given member");
            });
        }

        if (interaction) {
            const tag = args.shift();
            
            const member_id = tag.replace("<@!", "").replace(">", "");

            const reason = args.join(" ");

            const member = await interaction.guild.bans.fetch(member_id);

            if (!member) {
                await interaction.reply("Couldn't find banned member");
                return
            }

            interaction.guild.unban(member_id, `Unbanned by ${message.author.username} \nReason: ${reason}`).then(()=>{
                interaction.reply(`Unbanned <@${member_id}>`)
            }).catch(()=>{
                interaction.reply("Unable to unban given member");
            });
        }
    }
}