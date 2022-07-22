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

// setting up the command handler
const prefix = ";";
client.commands = new Discord.Collection();
client.colour = "#1f1e33";

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log("logged in as " + client.user.tag);
})

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if ((command.minArgs && args.length < command.minArgs) || (command.maxArgs && args.length > command.maxArgs)) {
        if (command.usage) {
            await message.reply(`Incorrect usage! Please use ${command.usage}`);
        } else {
            await message.reply("Incorrect usage!");
        }
    }


    try {
        command.execute(client, message, args);
    } catch (error) {
        await message.reply("There was an issue executing the command");
        console.error(error);
    }
});

client.login(process.env.TOKEN);