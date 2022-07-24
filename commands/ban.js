module.exports = {
    description: "ban a member",
    catergory: "Moderation",
    slash: true,
    minArgs: 1,
    usage: "<member> [reason]",
    
    execute: async ({client, message, interaction, args}) => {
        if (message) {
            const tag = args.shift();
            
            const member_id = tag.replace("<@!", "").replace(">", "");

            const reason = args.join(" ");

            const member = await message.guild.members.fetch(member_id);

            if (!member) {
                await message.reply("Couldn't find the specified member");
                return
            }

            await member.ban({reason: `Banned by ${message.author.username} \nReason: ${reason}`}).then(() => {
                await message.reply(`Banned <@${member_id}>`);
            }).catch(() => {
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

            await member.ban({reason: `Banned by ${interaction.author.username} \nReason: ${reason}`}).then(() => {
                await interaction.reply(`Banned <@${member_id}>`);
            }).catch(() => {
                await interaction.reply("Couldn't ban the specified member");
            })
        }
    }
}