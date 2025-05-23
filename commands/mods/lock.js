const Discord = require('discord.js');
const db = require('quick.db');
const {
    MessageActionRow,
    MessageButton,
    MessageMenuOption,
    MessageMenu
} = require('discord-buttons');

module.exports = {
    name: 'lock',
    aliases: [],
    run: async (client, message, args, prefix, color) => {

        const roleId = "1345176771032780953"; 
        const roleMembre = message.guild.roles.cache.get(roleId);
        
        if (!roleMembre) {
            return message.channel.send("Le rôle n'a pas été trouvé.");
        }

        try {
            if (args[0] === "all") {
                let perm = ""
                message.member.roles.cache.forEach(role => {
                    if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = null
                })
                if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm) {
                    message.guild.channels.cache.forEach((channel, id) => {
                        if (channel.permissionOverwrites) {
                            const permissions = channel.permissionOverwrites.cache.get(roleMembre.id);

                            channel.permissionOverwrites.edit(roleMembre, {
                                SEND_MESSAGES: false, 
                                ADD_REACTIONS: false,
                                SPEAK: false
                            }).catch(console.error);
                        }
                    });

                    message.channel.send(`${message.guild.channels.cache.size} salons fermés`);

                }
            } else {
                let perm = ""
                message.member.roles.cache.forEach(role => {
                    if (db.get(`modsp_${message.guild.id}_${role.id}`)) perm = null
                    if (db.get(`admin_${message.guild.id}_${role.id}`)) perm = null
                    if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true
                })
                if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm) {
                    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

                    if (channel.permissionOverwrites) {
                        const permissions = channel.permissionOverwrites.cache.get(roleMembre.id);

                        channel.permissionOverwrites.edit(roleMembre, {
                            SEND_MESSAGES: false, // Bloquer l'envoi de messages
                            ADD_REACTIONS: false, // Bloquer l'ajout de réactions
                        }).catch(console.error);
                    }
                    
                    message.channel.send(`Les membres ne peuvent plus parler dans <#${channel.id}>`);

                }

            }

        } catch (error) {
            message.channel.send(`Erreur: ${error}`);
            return;
        }
    }
};
