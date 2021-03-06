require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artist-search', (req, res, next) => {

  spotifyApi
  .searchArtists(req.query.searchArtists)
  .then(data => {
    let spotifyArtists = data.body.artists.items;   
    res.render('artist-search-results', {spotifyArtists});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      let albumsId = data.body.items; 
      res.render('albums', {albumsId});
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get('/tracks/:albumId', (req, res, next) => {
  const albumId = req.params.albumId;
  spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
      console.log(data.body)
      let tracksId = data.body.items;
      res.render('tracks', {tracksId})
    })
    .catch(err => console.log('The error while loading tracks occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


