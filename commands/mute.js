const { log } = require("../small_packages/log.js");
const { ApplicationCommandOptionType, PermissionsBitField} = require("discord.js");

module.exports = {
    description: "mute a member",
    category: "Moderation",
    usage: "<member> <time(hours or day)> [reason]",
    options: [{
        name: "member",
        description: "member to mute", 
        required: true,
        type: ApplicationCommandOptionType.String
    },
    {
        name: "time",
        description: "how long to mute the user (accepts hour or day)",
        required: true, 
        type: ApplicationCommandOptionType.String
    },
    {
        name: "reason",
        description: "reason to mute member", 
        required: false,
        type: ApplicationCommandOptionType.String
    }],

    execute: async ({interaction}) => {
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            await interaction.reply("You don't have permission to mute");
            return 
        }

        const tag = interaction.options.getString("member");

        const member_id = tag.replace("<@!", "").replace(">", "");

        const reason = interaction.options.getString("reason");

        const member = await interaction.guild.members.fetch(member_id);
        
        const mutetime = interaction.options.getString("time");

        let hours;

        if (mutetime.substr(mutetime.length - 1) === "d") {
            const pretime = mutetime.substring(0, mutetime.length - 1);
            if (isNaN(pretime)){
                interaction.reply("not a valid time");
                return
            }
            hours = parseInt(pretime) * 24;
        } else if (mutetime.substr(mutetime.length -1) === "h") {
            const pretime = mutetime.substring(0, mutetime.length - 1);
            if (isNaN(pretime)) {
                interaction.reply("not a valid time");
                return
            }
            hours = parseInt(pretime);
        } else {
            hours = parseInt(mutetime);
        }

        if (!member) {
            await interaction.reply("Couldn't find the specified member");
            return 
        }

        if (member.communicationDisabledUntil) {
            await interaction.reply("member is already muted");
            return
        }

        await member.timeout(hours * 60 * 1000).then(async () => {
            await log(interaction, "720664199931625482", member, "Timeout", reason);
            await interaction.reply(`Muted <@${member_id}> for ${hours}hours`);
        }).catch(async () => {
            await interaction.reply("Couldn't mute the specified member")
        });

    }
}