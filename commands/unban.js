const {log} = require("../small_packages/log.js");
const {ApplicationCommandOptionType} = require("discord.js");

module.exports = {
    description: "unban a member",
    category: "Moderation",
    slash: true,
    minArgs: 1,
    usage: "<member> [reason]",
    options: [{
        name: "member",
        description: "member to ban", 
        required: true,
        type: ApplicationCommandOptionType.String
    },
    {
        name: "reason",
        description: "reason to ban member", 
        required: false,
        type: ApplicationCommandOptionType.String
    }],
    
    execute: async ({message, interaction, args}) => {
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
                log(message, "720664199931625482", member, "Unban", reason);
            }).catch(()=>{
                message.reply("Unable to unban given member");
            });
        }

        if (interaction) {
            const tag = interaction.options.getString("member");
            
            const member_id = tag.replace("<@!", "").replace(">", "");

            const reason = interaction.options.getString("reason");

            const member = await interaction.guild.bans.fetch(member_id);

            if (!member) {
                await interaction.reply("Couldn't find banned member");
                return
            }

            interaction.guild.unban(member_id, `Unbanned by ${interaction.user.username} \nReason: ${reason}`).then(async ()=>{
                await log(interaction, "720664199931625482", member, "Unban", reason);
                await interaction.reply(`Unbanned <@${member_id}>`)
            }).catch(()=>{
                interaction.reply("Unable to unban given member");
            });
        }
    }
}
