require("dotenv").config();

var keys = require("./key.js");

var Twitter = require("twitter");
var spotify = require("spotify");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
