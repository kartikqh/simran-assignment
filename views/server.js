const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the directory where your EJS templates are located
app.set('views', __dirname + '/views');

// Define your routes and other middleware here
// ...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
