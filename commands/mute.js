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
        type: ApplicationCommandOptionType.User
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

    execute: async ({client, interaction}) => {
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            await interaction.reply("You don't have permission to mute");
            return 
        }

        const reason = await interaction.options.getString("reason");

        const user = await interaction.options.getUser("member");

        const member = await interaction.guild.members.fetch(user);
        
        const mutetime = await interaction.options.getString("time");

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

        if (user.bot) {
            await interaction.reply("Unable to timeout bot");
            return
        }

        if (!member) {
            await interaction.reply("Couldn't find the specified member");
            return 
        }

        if (member.communicationDisabledUntil) {
            await interaction.reply("member is already muted");
            return
        }

        await member.timeout(hours * 60 * 60 * 1000).then(async () => {
            await log(interaction, client.log_channel, member, "Timeout (" + hours + " hours)", reason);
            await interaction.reply(`Muted <@${member.id}> for ${hours} hours`);
        }).catch(async (err) => {
            console.error(err)
            await interaction.reply("Couldn't mute the specified member")
        });

    }
}