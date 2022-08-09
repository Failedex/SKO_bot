const Discord = require("discord.js");
const {GatewayIntentBits} = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");
const sqlite3 = require("sqlite3");

dotenv.config();
const mod_db = sqlite3.Database("./small_packages/moderation.db");

const client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks
    ]
});


client.on('ready', () => {
    console.log("logged in as " + client.user.tag);

    // setting up the command handler
    const slash_commands = client.application.commands
    client.commands = new Discord.Collection();
    client.colour = 0x1f1e33;

    const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        if (command.description === undefined|| command.category === undefined) {
            console.log(file);
            throw Error("jeez at least tell me the description and the description! o(≧口≦)o");
        }

        client.commands.set(file.replace(".js", ""), command);

        // ig all commands are slash now
        slash_commands.create({
            name: file.replace(".js", ""),
            description: command.description,
            options: command.options
        })
    }
})

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (client.commands.has(commandName)) {
        const command = client.commands.get(interaction.commandName);

        try {
            command.execute({client: client, interaction: interaction});
        } catch (error) {
            await interaction.reply("There was an issue executing the command");
            console.error(error);
        }
    }
})

// remember to unmute when needed
const sko = client.guilds.cache.get("680152209450991780");
const muted = sko.roles.cache.get("694312034464170066");

mod_db.serialize(() => {
    mod_db.each("SELECT * FROM mutes", (err, row) => {
        if (err) {
            console.error(err);
            return
        }

        const unmute = (member_id) => {
            const member = sko.members.fetch(member_id);

            if (member.roles.cache.get(muted)) {
                member.roles.remove(muted, "Auto unmute");
            }
        };

        if (row.mute_start + row.mute_length > Date.now()) {
            unmute(row.member_id);
        } else {
            setTimeout(unmute(row.member_id), Date.now() - row.mute_start + row.mute_length);
        }
    });
})

client.login(process.env.TOKEN);
