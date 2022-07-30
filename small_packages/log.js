const { EmbedBuilder } = require("discord.js");

const log = async (message, channel_id, member, action, reason) => {
    const channel = message.guild.channels.cache.get(channel_id);
    const embed = new EmbedBuilder()
    .setAuthor({name: `${member.user.tag}`, iconURL: member.user.avatarURL()})
    .setTitle(action)
    .setColor(message.client.colour)
    .setDescription(`*Offender:* ${member.user.tag}\n*Reason:* ${reason}\n*Responsible Moderator:* ${message.author.username}${message.author.tag}`)
    .setFooter({text: `ID ${member.user.id}`})
    .setTimestamp()

    await channel.send({embeds: [embed]});
}

exports.log = log;
