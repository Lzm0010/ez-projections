//3rd party modules
let express = require('express');

let app = express();
let port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('We up in dis b!');
});

app.listen(port);
