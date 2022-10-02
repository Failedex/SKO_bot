const {EmbedBuilder} = require("discord.js");

const questions = {
    
}

const options = {

}

class greeter {
    constructor(client, member, interaction) {
        this.client = client;
        this.member = member;
        this.interaction = interaction;
        this.message;
        this.stage = 0;
        this.data = {};
    }

    async ask (topic, question, options) {
        const embed = new EmbedBuilder()
        .setTitle(question)
        .setColor(this.client.colour)
        
        for (const option of options) {
            embed.addFields({name: option})
        }

        await this.interaction.editReply({embeds: [embed]});
    }
}