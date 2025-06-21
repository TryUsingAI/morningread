const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.TRELLO_KEY;
const TOKEN = process.env.TRELLO_TOKEN;
const BOARD_ID = process.env.TRELLO_BOARD_ID;

const todayISO = new Date().toISOString().split('T')[0];

(async () => {
  const listURL = `https://api.trello.com/1/boards/${BOARD_ID}/cards?key=${API_KEY}&token=${TOKEN}&fields=name,due,idList,url`;
  const res = await fetch(listURL);
  const cards = await res.json();

  const todayCards = cards.filter(c => {
    if (!c.due) return false;
    return c.due.startsWith(todayISO);
  });

  const tasks = todayCards.map(card => ({
    name: card.name,
    due: card.due,
    url: card.url
  }));

  const outputPath = path.join(__dirname, '../data/dailyTasks.json');
  fs.writeFileSync(outputPath, JSON.stringify(tasks, null, 2));
})();
