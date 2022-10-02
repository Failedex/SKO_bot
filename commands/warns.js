const { ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder} = require("discord.js")

const sqlite3 = require("sqlite3").verbose();

const mod_db = new sqlite3.Database("./small_packages/moderation.db");

module.exports = {
    description: "view a members' warns", 
    category : "Moderation",
    usage: "<member>",
    options: [{
        name: "member",
        description: "member to view warn of",
        required: true,
        type: ApplicationCommandOptionType.User
    }],

    execute: async ({client, interaction}) => {
        
        // change this later
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            await interaction.reply("You don't have permission to mute");
            return 
        }

        const member = interaction.options.getUser("member");

        mod_db.serialize(async () => {
            mod_db.get("SELECT warns FROM warns WHERE member_id = ?", [member.id], async (err, row) => {
                if (err) {
                    console.error(err);
                    return
                }

                if (!row) {
                    await interaction.reply("Member has no active warnings");
                    return
                }

                mod_db.all("SELECT * FROM warn_reasons WHERE member_id = ?", [member.id], async (err, rows) => {
                    if (err) {
                        console.error(err);
                        return
                    }


                    const embed = new EmbedBuilder()
                    .setColor(client.colour)
                    .setTitle(`${member.tag} warns`)

                    for (row of rows) {
                        embed.addFields({name: "warn id: "+String(row.id), value: "reason: " + row.reason})
                    }

                    await interaction.reply({embeds: [embed]});
                });

            });
        });
    
    }
}
