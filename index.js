const Discord = require("discord.js");
const {GatewayIntentBits} = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

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

client.login(process.env.TOKEN);
