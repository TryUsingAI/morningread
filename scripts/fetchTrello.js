import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.TRELLO_KEY;
const TOKEN = process.env.TRELLO_TOKEN;
const BOARD_ID = process.env.TRELLO_BOARD_ID;

const todayISO = new Date().toISOString().split('T')[0];

const run = async () => {
  const listURL = `https://api.trello.com/1/boards/${BOARD_ID}/cards?key=${API_KEY}&token=${TOKEN}&fields=name,due,idList,url`;
  const res = await fetch(listURL);
  const cards = await res.json();

  const todayCards = cards.filter(c => c.due?.startsWith(todayISO));

  const tasks = todayCards.map(card => ({
    name: card.name,
    due: card.due,
    url: card.url
  }));

  const outputPath = path.resolve('data/dailyTasks.json');
  fs.writeFileSync(outputPath, JSON.stringify(tasks, null, 2));
};

run();
