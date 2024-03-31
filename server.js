const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const expressApp = express();

  expressApp.use(bodyParser.json());

  expressApp.use(express.static(path.join(__dirname, 'public')));

  expressApp.all('*', (req, res) => handle(req, res));

  expressApp.listen(3000, () => console.log('Server running on http://localhost:3000'));
});
