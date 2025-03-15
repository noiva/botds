const Discord = require('discord.js')
const db = require('quick.db')
const {
	MessageActionRow,
	MessageButton,
	MessageMenuOption,
	MessageMenu
} = require('discord-buttons');



module.exports = {
	name: 'unlock',
	aliases: [],
	run: async (client, message, args, prefix, color) => {

		const roleId = "1345176771032780953"; 
		const roleMembre = message.guild.roles.cache.get(roleId);
		
		try {
			if (args[0] === "all") {
				let perm = ""
				message.member.roles.cache.forEach(role => {
					if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = null
				})
				if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm) {
					message.guild.channels.cache.forEach((channel, id) => {
						const permissions = channel.permissionOverwrites.cache.get(roleMembre.id);

   						 channel.permissionOverwrites.edit(roleMembre, {
      						 	SEND_MESSAGES: true, 
        						ADD_REACTIONS: true, 
    						}).catch(console.error);
					}, `Tout les salon fermé par ${message.author.tag}`);



					message.channel.send(`${message.guild.channels.cache.size} salons ouvert`);

				}
			} else {
				let perm = ""
				message.member.roles.cache.forEach(role => {
					if (db.get(`modsp_${message.guild.id}_${role.id}`)) perm = null
					if (db.get(`admin_${message.guild.id}_${role.id}`)) perm = null
					if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true
				})
				if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm) {
					let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel
						 const permissions = channel.permissionOverwrites.cache.get(roleMembre.id);

   						 channel.permissionOverwrites.edit(roleMembre, {
      						 	SEND_MESSAGES: true, 
        						ADD_REACTIONS: true, 
    						}).catch(console.error);

					message.channel.send(`Les membres peuvent parler dans <#${channel.id}>`);



				}
			}

		} catch (error) {
			return;
		}
	}
}
