const express = require('express');
const app = express();
const bp = require('body-parser');
const exphbs = require('express-handlebars')
const PORT = process.env.EXPRESS_CONTAINER_PORT || 8080;

app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')


app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('sanity check');
});

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
});

