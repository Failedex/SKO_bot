
const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js")

const sqlite3 = require("sqlite3").verbose();

const mod_db = new sqlite3.Database("./small_packages/moderation.db");

module.exports = {
    description: "remove a warn", 
    category : "Moderation",
    usage: "<warn id>",
    options: [{
        name: "warn_id",
        description: "warn id",
        required: true,
        type: ApplicationCommandOptionType.Integer
    }],

    execute: async ({ interaction}) => {
        
        // change this later
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            await interaction.reply("You don't have permission to mute");
            return 
        }

        const warn_id = interaction.options.getInteger("warn_id");

        mod_db.serialize(async () => {
            mod_db.get("SELECT member_id, id from warn_reasons WHERE id = ?", [warn_id], async (err, row) => {
                if (err) {
                    console.error(err);
                    return
                }

                if (!row) {
                    await interaction.reply("Warn not found");
                    return
                }

                mod_db.get("SELECT * FROM warns WHERE member_id = ?", [row.member_id], async (err, row) => {
                    if (err) {
                        console.error(err);
                        return
                    }
                    if (!row) {
                        console.error("no warn but there is warn reason?");
                        return
                    }

                    const warns = --row.warns;
                    if (warns > 0) {
                        mod_db.run("UPDATE warns SET warns = ? WHERE member_id = ?", [warns, row.member_id]);
                    } else {
                        mod_db.run("DELETE FROM warns WHERE member_id = ?", [row.member_id]);
                    }

                });
                mod_db.run("DELETE FROM warn_reasons WHERE id = ?", [warn_id]);
                await interaction.reply(`warn removed from member`);
            })
        });
    
    }
}
