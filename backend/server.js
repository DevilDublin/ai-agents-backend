import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import appointmentBot from './bots/appointment.js';
import supportBot from './bots/support.js';
import automationBot from './bots/automation.js';
import internalBot from './bots/internal.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req,res)=> res.json({ok:true, service:'ai-agents-backend'}));
app.get('/health', (req,res)=> res.json({status:'healthy'}));

app.post('/appointment', (req,res)=>{
  const {message='', sessionId='guest'} = req.body||{};
  return res.json({reply: appointmentBot(message, sessionId)});
});
app.post('/support', (req,res)=>{
  const {message=''} = req.body||{};
  return res.json({reply: supportBot(message)});
});
app.post('/automation', (req,res)=>{
  const {message=''} = req.body||{};
  return res.json({reply: automationBot(message)});
});
app.post('/internal', (req,res)=>{
  const {message=''} = req.body||{};
  return res.json({reply: internalBot(message)});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('AI Agents backend on', PORT));
