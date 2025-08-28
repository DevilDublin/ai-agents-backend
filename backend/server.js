import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import appointmentBot from './bots/appointment.js';
import supportBot from './bots/support.js';
import automationBot from './bots/automation.js';
import internalBot from './bots/internal.js';

const app = express();
app.use(cors({ origin: '*', methods: ['GET','POST','OPTIONS'], allowedHeaders: ['Content-Type'] }));
app.use(bodyParser.json());

app.get('/', (req,res)=> res.json({ok:true, service:'ai-agents-backend'}));
app.get('/health', (req,res)=> res.json({status:'healthy'}));

app.post('/appointment', async (req,res)=>{
  const {message='', sessionId='guest'} = req.body||{};
  res.json({ reply: await appointmentBot(message, sessionId) });
});
app.post('/support', async (req,res)=>{
  const {message=''} = req.body||{};
  res.json({ reply: await supportBot(message) });
});
app.post('/automation', async (req,res)=>{
  const {message=''} = req.body||{};
  res.json({ reply: await automationBot(message) });
});
app.post('/internal', async (req,res)=>{
  const {message=''} = req.body||{};
  res.json({ reply: await internalBot(message) });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('AI Agents backend on', PORT));
