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

client.prefix = ";";

client.on('ready', () => {
    console.log("logged in as " + client.user.tag);

    // setting up the command handler
    const slash_commands = client.application.commands
    client.commands = new Discord.Collection();
    client.colour = 0x1f1e33;

    const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        if (command.description === undefined|| command.slash === undefined|| command.category === undefined) {
            console.log(file);
            throw Error("jeez at least tell me the description and the slash command info! o(≧口≦)o");
        }

        client.commands.set(file.replace(".js", ""), command);

        if (command.aliases) {
            for (const alias of command.aliases) {
                command.hidden = true;
                client.commands.set(alias, command)
            }
        }

        // slash commands
        if (command.slash) {
            slash_commands.create({
                name: file.replace(".js", ""),
                description: command.description,
                options: command.options
            })
        }
    }
})

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(client.prefix) || message.author.bot) return;
    const args = message.content.slice(client.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if ((command.minArgs !== undefined && args.length < command.minArgs) || (command.maxArgs !== undefined && args.length > command.maxArgs)) {
        if (command.usage) {
            await message.reply(`Incorrect usage! Please use ${command.usage}`);
        } else {
            await message.reply("Incorrect usage!");
        }
        return;
    }

    try {
        command.execute({client: client, message: message, args: args});
    } catch (error) {
        await message.reply("There was an issue executing the command");
        console.error(error);
    }
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
