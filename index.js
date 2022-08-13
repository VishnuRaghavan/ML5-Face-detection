const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');


app.get('/', (req,res) => {
    res.render('main', {title: 'Neural Network'});
});

app.get('*', (req,res) => {
    res.redirect('/');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {console.log(`listening on port ${port}`)});
