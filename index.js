const dotenv = require('dotenv').config();
const Rivescript = require('rivescript');
const RtmClient = require('@slack/client').RtmClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const repl = require('./repl');

const token = process.env.SLACK_BOT_TOKEN || '';
const defaultChannel = process.env.DEFAULT_CHANNEL || 'general';

const rs = new Rivescript();
const rtm = new RtmClient(token);

let channel;

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  for(const c of rtmStartData.channels){
    if(c.is_member && c.name === defaultChannel) { channel = c.id }
  }
  console.log(`Logged in as ${rtmStartData.self.name} of ${rtmStartData.team.name}, but not connected to channel yet`);
});

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  console.log('Connection opened');
  // rtm.sendMessage('Hello! I am a sentient droid', channel);
});

rtm.on(CLIENT_EVENTS)

rtm.start();

rs.loadDirectory('./brain', () => {
  rs.sortReplies();
  rtm.on(RTM_EVENTS.MESSAGE, (message) => {
    console.log('Message', message);
    const commandPrefix = '`';
    if(message.text && message.text.length){
      const nameMatch = /(^|(\s|@))(sia)/i.test(message.text);
      if(message.text.slice(0, 1) === commandPrefix){
        const filteredText = message.text.slice(1);
        const code = filteredText.split(' ')[0];
        if(Object.keys(repl).indexOf(code) == -1){
          console.log(Object.keys(repl).indexOf(code), code, 'rive');
          const reply = rs.reply(message.user, filteredText);
          rtm.sendMessage(reply, message.channel);
        }else{
          console.log('repl');
          rtm.sendMessage(repl.js(code), message.channel);
        }
      }else if(nameMatch){
        const reply = rs.reply(message.user, message.text.replace(/sia/i, ''));
        rtm.sendMessage(reply, message.channel);
      }
    }
  });
});
