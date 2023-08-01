const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const methodOverride = require('method-override');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

var favId = [];
var movies = [];

//Search Page Render Route
app.get('/search', (req, res) => {
    res.render('movieSearch');
})

//Show Matches Page Route
app.post('/api/movies/search', async (req, res) => {
    try {
        const term = req.body.movie;
        const movies = await axios.get(`https://www.omdbapi.com/?s=${term}&apikey=fe5b2a47`)
        //console.log(movies.data);
        res.render('show', { movies });
    } catch (e) {
        console.log('ERROR OCCURED!!', e);
    }
})

//Add To Favorites Route
app.post('/api/movies/favorites/:id', (req, res) => {
    const { id } = req.params;
    favId.push(id);

})

//Display Favorites Route
app.get('/api/movies/favorites', async (req, res) => {
    try {
        for (let id of favId) {
            const movie = await axios.get(`https://www.omdbapi.com/?i=${id}&apikey=fe5b2a47`);
            // console.log(movie.data);
            movies.push(movie);
        }
        // console.log(movies);
        res.render('favorites', { movies });
    } catch (e) {
        console.log('ERROR OCCURED!!', e);
    }
})

//Remove From Favorites Routes
app.delete('/api/movies/favorites/:id/remove', (req, res) => {
    try {
        const { id, obj } = req.params;
        favId = favId.filter(f => f !== id);
        movies = movies.filter(m => m.id !== id);
        res.redirect('/api/movies/favorites');
    } catch (e) {
        console.log('ERROR OCCURED!!', e);
    }
})


app.listen(3000, () => {
    console.log('APP IS LISTENING ON PORT 3000!');
})

//https://www.omdbapi.com/?t=extraction&apikey=fe5b2a47