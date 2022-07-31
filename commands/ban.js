const { log } = require("../small_packages/log.js")
const { ApplicationCommandOptionType } = require("discord.js")

module.exports = {
    description: "ban a member",
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

            const member = await message.guild.members.fetch(member_id);

            if (!member) {
                await message.reply("Couldn't find the specified member");
                return
            }

            await member.ban({reason: `Banned by ${message.author.username} \nReason: ${reason}`}).then(async () => {
                await message.reply(`Banned <@${member_id}>`);
                await log(message, "720664199931625482", member, "Ban", reason);
            }).catch(async () => {
                await message.reply("Couldn't ban the specified member");
            })
        }

        if (interaction) {
            const tag = interaction.options.getString("member");
            
            const member_id = tag.replace("<@!", "").replace(">", "");

            const reason = interaction.options.getString("reason");

            const member = await interaction.guild.members.fetch(member_id);

            if (!member) {
                await interaction.reply("Couldn't find the specified member");
                return
            }

            await member.ban({reason: `Banned by ${interaction.user.username} \nReason: ${reason}`}).then(async () => {
                await log(interaction, "720664199931625482", member, "Ban", reason);
                await interaction.reply(`Banned <@${member_id}>`);
            }).catch(async () => {
                await interaction.reply("Couldn't ban the specified member");
            })
        }
    }
}
