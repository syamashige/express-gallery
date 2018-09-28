const express = require('express');
const app = express();
const bp = require('body-parser');
const exphbs = require('express-handlebars')
const methodOverride = require('method-override');

const PORT = process.env.EXPRESS_CONTAINER_PORT || 8080;

const Users = require('./models/Users');
const Content = require('./models/Content');

app.use(express.static('public'))

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')


/*---------Get Pages------------*/

// Display Contents
  app.get('/', (req, res) => {
    Content
      .fetchAll()
      .then(contents => {
        console.log('contents', contents.models[0].attributes.image_url);
        let obj = contents.toJSON();
        console.log(obj);
        res.render('home', {obj});
      })
      .catch(err => {
          res.json(err);
      });
  });

  // New item form
app.get('/gallery/new', (req, res) => {
    res.render('form');
});

  // Display Gallery item by ID
app.get('/gallery/:id', (req, res) => {
    const { id } = req.params;
    Content
        .where({ id })
        .fetchAll()
        .then(results => {
            let obj = results.toJSON();
            res.render('detail', { obj });
        })
        .catch(err => {
            res.json(err);
        });
});


// Create new gallery item
app.post('/gallery/new', (req, res) => {
    const { id } = req.params;
    const payload = {
        title: req.body.title,
        link: req.body.link,
        image_url: req.body.image_url,
        description: req.body.description
    }
    Content
        .forge(payload)
        .save()
        .then(result => {
            res.redirect('/');
        })
        .catch(err => {
            res.json(err);
        });
});

// Render Gallery Item Edit Form by ID
app.get('/gallery/:id/edit', (req, res) => {
    const { id } = req.params;
    
    Content
        .where({ id })
        .fetchAll()
        .then(results => {
            console.log('edit results', results);
            let editObj = results.toJSON();
            res.render('edit', { editObj });
        })
        .catch(err => {
            res.json(err);
        });
});

// Edit Gallery Item by ID
app.put('/gallery/:id', (req, res) => {
    const { id } = req.params;
    const payload = {
        title: req.body.title,
        link: req.body.link,
        image_url: req.body.image_url,
        description: req.body.description
    }

    Content
        .where({ id })
        .fetch()
        .then(results => {
            return results.save(payload)
        })
        .then(results => {
            res.redirect('/');
            // res.redirect(`/gallery/${(id)}`)
        })
        .catch(err => {
            res.json(err);
        });
});


app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
});

