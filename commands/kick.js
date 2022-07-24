module.exports = {
    description: "kick a member",
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

            await member.kick({reason: `Kicked by ${message.author.username} \nReason: ${reason}`}).then(() => {
                await message.reply(`Kicked <@${member_id}>`);
            }).catch(() => {
                await message.reply("Couldn't kick the specified member");
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

            await member.kick({reason: `Kicked by ${interaction.author.username} \nReason: ${reason}`}).then(() => {
                await interaction.reply(`Kicked <@${member_id}>`);
            }).catch(() => {
                await interaction.reply("Couldn't kick the specified member");
            })
        }
    }
}