const {log} = require("../small_packages/log.js");

module.exports = {
    description: "kick a member",
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

            await member.kick({reason: `Kicked by ${message.author.username} \nReason: ${reason}`}).then(async () => {
                await message.reply(`Kicked <@${member_id}>`);
                await log(message, "720664199931625482", member, "Kick", reason);
            }).catch(async (e) => {
                await message.reply("Couldn't kick the specified member");
                console.error(e);
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

            await member.kick({reason: `Kicked by ${interaction.author.username} \nReason: ${reason}`}).then(async () => {
                await interaction.reply(`Kicked <@${member_id}>`);
                await log(interaction, "720664199931625482", member, "Kick", reason);
            }).catch(async () => {
                await interaction.reply("Couldn't kick the specified member");
            })
        }
    }
}
