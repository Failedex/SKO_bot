const {log} = require("../small_packages/log.js");
const {ApplicationCommandOptionType, PermissionsBitField} = require("discord.js")

module.exports = {
    description: "kick a member",
    category: "Moderation",
    usage: "<member> [reason]",
    options: [{
        name: "member",
        description: "member to ban", 
        required: true,
        type: ApplicationCommandOptionType.User
    },
    {
        name: "reason",
        description: "reason to ban member", 
        required: false,
        type: ApplicationCommandOptionType.String
    }],
    
    execute: async ({interaction, client}) => {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            await interaction.reply("You don't have permission to kick");
            return 
        }

        const reason = interaction.options.getString("reason");

        const user = await interaction.options.getUser("member");

        const member = await interaction.guild.members.fetch(user);

        if (!member) {
            await interaction.reply("Couldn't find the specified member");
            return
        }

        await member.kick({reason: `Kicked by ${interaction.user.username} \nReason: ${reason}`}).then(async () => {
            await log(interaction, client.log_channel, member, "Kick", reason);
            await interaction.reply(`Kicked ${member.tag}`);
        }).catch(async () => {
            await interaction.reply("Couldn't kick the specified member");
        })
    }
}
