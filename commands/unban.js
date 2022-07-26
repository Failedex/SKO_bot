const {log} = require("../small_packages/log.js");
const {ApplicationCommandOptionType, PermissionsBitField} = require("discord.js");

module.exports = {
    description: "unban a member",
    category: "Moderation",
    usage: "<member> [reason]",
    options: [{
        name: "member",
        description: "member to unban", 
        required: true,
        type: ApplicationCommandOptionType.String
    },
    {
        name: "reason",
        description: "reason to unban member", 
        required: false,
        type: ApplicationCommandOptionType.String
    }],
    
    execute: async ({ client, interaction }) => {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            await interaction.reply("You don't have permission to unban");
            return
        }
        const tag = interaction.options.getUser("member");
        
        const member_id = tag.replace("<@!", "").replace(">", "");

        const reason = interaction.options.getString("reason");

        const member = await interaction.guild.bans.fetch(member_id);

        if (!member) {
            await interaction.reply("Couldn't find banned member");
            return
        }

        interaction.guild.unban(member_id, `Unbanned by ${interaction.user.username} \nReason: ${reason}`).then(async ()=>{
            await log(interaction, client.log_command, member, "Unban", reason);
            await interaction.reply(`Unbanned <@${member_id}>`)
        }).catch(()=>{
            interaction.reply("Unable to unban given member");
        });
    }
}
