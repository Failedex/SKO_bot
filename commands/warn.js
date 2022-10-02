// const { log } = require("../small_packages/log.js");
const { ApplicationCommandOptionType, PermissionsBitField} = require("discord.js");
const sqlite3 = require("sqlite3").verbose();

const mod_db = new sqlite3.Database("./small_packages/moderation.db")

module.exports = {
    description: "warns a member",
    category: "Moderation",
    usage: "<member> <reason>",
    options: [{
        name: "member",
        description: "member to mute", 
        required: true,
        type: ApplicationCommandOptionType.User
    },
    {
        name: "reason",
        description: "reason to mute member", 
        required: false,
        type: ApplicationCommandOptionType.String
    }],

    execute: async ({interaction}) => {
        
        // change this later
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            await interaction.reply("You don't have permission to mute");
            return 
    ;    }

        // const tag = interaction.options.getString("member");

        // const member_id = tag.replace("<@!", "").replace(">", "");

        // const reason = interaction.options.getString("reason");

        // const member = await interaction.guild.members.fetch(member_id);
        const member = await interaction.options.getUser("member");
        let reason = await interaction.options.getString("reason")
        
        if (!reason) {reason = "No reason given"}

        if (!member) {
            await interaction.reply("Couldn't find the specified member");
            return 
        }

        mod_db.serialize(async () => {
            mod_db.get("SELECT * FROM warns WHERE member_id = ?", [member.id], async (err, row) => {
                if (err) {
                    console.error(err);
                    return
                }

                if (row) {
                    const warns = ++row.warns;
                    mod_db.run("UPDATE warns SET warns = ? WHERE member_id = ?", [warns, member.id]);
                    mod_db.run("INSERT INTO warn_reasons(warn_id, member_id, reason) VALUES (?, ?, ?)", [warns, member.id, reason]);
                    await interaction.reply(`member ${member.tag} has been warned. warn number: ${warns}`)
                } else {
                    mod_db.run("INSERT INTO warns (member_id, warns) VALUES (?, ?)", [member.id, 1]);
                    mod_db.run("INSERT INTO warn_reasons (warn_id, member_id, reason) VALUES (?, ?, ?)", [1, member.id, reason]);
                    await interaction.reply(`member ${member.tag} has been warned. warn number: 1`)
                }

            })
        })
    }
}
