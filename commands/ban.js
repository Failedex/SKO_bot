const { log } = require("../small_packages/log.js")

module.exports = {
    description: "ban a member",
    category: "Moderation",
    slash: true,
    minArgs: 1,
    usage: "<member> [reason]",
    
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
            const tag = args.shift();
            
            const member_id = tag.replace("<@!", "").replace(">", "");

            const reason = args.join(" ");

            const member = await interaction.guild.members.fetch(member_id);

            if (!member) {
                await interaction.reply("Couldn't find the specified member");
                return
            }

            await member.ban({reason: `Banned by ${interaction.author.username} \nReason: ${reason}`}).then(async () => {
                await interaction.reply(`Banned <@${member_id}>`);
                await log(interaction, "720664199931625482", member, "Ban", reason);
            }).catch(async () => {
                await interaction.reply("Couldn't ban the specified member");
            })
        }
    }
}
