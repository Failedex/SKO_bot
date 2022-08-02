const {log} = require("../small_packages/log.js");
const {ApplicationCommandOptionType, PermissionsBitField} = require("discord.js")

module.exports = {
    description: "kick a member",
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

        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            await message.reply("You don't have permission to kick");
        }

        if (message) {
            const tag = args.shift();
            
            const member_id = tag.replace("<@!", "").replace(">", "");

            const reason = args.join(" ");

            const member = await message.guild.members.fetch(member_id);

            if (!member) {
                await message.reply("Couldn't find the specified member");
                return
            }

            await member.kick({reason: `Kicked by ${message.author.username} \nReason: ${reason}`}).then(async () => {
                await message.reply(`Kicked <@${member_id}>`);
                await log(message, "720664199931625482", member, "Kick", reason);
            }).catch(async (e) => {
                await message.reply("Couldn't kick the specified member");
                console.error(e);
            })
        }

        if (interaction) {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
                await interaction.reply("You don't have permission to kick");
            }
            const tag = interaction.options.getString("member");
            
            const member_id = tag.replace("<@!", "").replace(">", "");

            const reason = interaction.options.getString("reason");

            const member = await interaction.guild.members.fetch(member_id);

            if (!member) {
                await interaction.reply("Couldn't find the specified member");
                return
            }

            await member.kick({reason: `Kicked by ${interaction.user.username} \nReason: ${reason}`}).then(async () => {
                await log(interaction, "720664199931625482", member, "Kick", reason);
                await interaction.reply(`Kicked <@${member_id}>`);
            }).catch(async () => {
                await interaction.reply("Couldn't kick the specified member");
            })
        }
    }
}
