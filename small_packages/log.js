const { EmbedBuilder } = require("discord.js");

const log = async (message, channel_id, member, action, description, footer) => {
    const channel = message.guild.channels.get(channel_id);
    const embed = new EmbedBuilder()
    .setAuthor({name: `${member.user.username}${member.user.tag}`, iconURL: member.user.avatarURL()})
    .setTitle(action)
    .setDescription(description)
    .setFooter({text: `ID ${member.user.id}`})
    .setTimestamp()

    await channel.send(embed);
}

exports.log = log;