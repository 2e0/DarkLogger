const { Client, MessageEmbed, Collection } = require('discord.js-selfbot-v13');
const colors = require('colors');
const { exec } = require('child_process');
const clear = require('clear');
const fs = require('fs');

const client = new Client({
  checkUpdate: false,
});

client.on('ready', async () => {
  console.log('\x1Bc');
    console.log(`${client.user.username} est connecté à DarkLogger V2`.blue);
});

client.on('message', (message) => {
  if (message.content === '?ms') {
    message.channel.send('`WebSocket Ping (tout fonctionne): `' + `**${client.ws.ping}**` + '`ms.` :green_book:');
  }
});

let logDM = false;

client.on('message', (message) => {
  if (message.content === '?logdm') {
    logDM = !logDM;
    message.channel.send(`**Logging des DM** ${logDM ? '`activé`' : '`désactivé`'}.`);
    if (!logDM) {
      const fileName = 'log_dm.txt';
      fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        exec(`curl -H "Content-Type: text/plain" --data-binary "@${fileName}" "https://xpaste.pro/paste-file?language=markdown"`, (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
          message.channel.send('`Voici le lien : `' + `**${stdout}**` + ' :green_book:');
        });
      });
    }
  }


  if (logDM && message.channel.type === 'DM') {
    const fileName = 'log_dm.txt';
    const data = `${message.author.username}: ${message.content}\n`;
    fs.appendFile(fileName, data, (err) => {
      if (err) {
        console.error(err);
      }
    });
    console.log(`${message.author.username}: ${message.content}`);
  }
});
 
let logGroup = false;
const logFilePath = 'group_logs.txt';

client.on('message', (message) => {
  if (message.content === '?logserv') {
    logGroup = !logGroup;
    message.channel.send(`**Logging des serveurs** ${logGroup ? '`activé`' : '`désactivé`'}.`);
  }

  if (!logGroup && message.channel.type === 'GUILD_TEXT') {
    const logMessage = `${message.author.username} (${message.guild.name}): ${message.content}`;
    console.log(logMessage);
    fs.appendFileSync(logFilePath, `${logMessage}\n`);
  } else if (!logGroup && message.channel.type !== 'GUILD_TEXT') {
    const curlCommand = `curl -i -H "Content-Type: text/plain" --data-binary "@group_logs.txt" "https://xpaste.pro/paste-file?language=plain"`;
    exec(curlCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Une erreur est survenue lors de l'exécution de la commande : ${error}`);
        return;
      }
      console.log(`Le contenu de ${logFilePath} a été envoyé à xpaste.pro avec succès.`);
      console.log(`Voici ${stdout} qui est le lien.`);
    });
  }
});

client.login('ODc0NzQ5NDI3OTEzNDgyMjYw.GblvaG.P_nR6ZhpUK5P3dgfqLKasJ5XuuNl8cMS4N05fA');