const { log } = require("../small_packages/log.js")
const { ApplicationCommandOptionType , PermissionsBitField} = require("discord.js")

module.exports = {
    description: "ban a member",
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
    
    execute: async ({interaction}) => {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            await interaction.reply("You don't have permission to ban");
            return
        }
        
        const reason = interaction.options.getString("reason");

        const user = await interaction.options.getUser("member");

        const member = await interaction.guild.members.fetch(user);

        if (!member) {
            await interaction.reply("Couldn't find the specified member");
            return
        }

        await member.ban({reason: `Banned by ${interaction.user.username} \nReason: ${reason}`}).then(async () => {
            await log(interaction, "720664199931625482", member, "Ban", reason);
            await interaction.reply(`Banned ${member.tag}`);
        }).catch(async () => {
            await interaction.reply("Couldn't ban the specified member");
        })
    }
}
