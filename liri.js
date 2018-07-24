require("dotenv").config();

var keys = require("./key.js");
console.log("keys! ....", keys);
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

var fs = require("fs");
var filename = './log.txt';
var log = require('simple-node-logger').createSimpleFileLogger(filename);
log.setLevel('all');
var request = require("request");

var action = process.argv[2];
var argument = "";

// Determine the action and require specific data

askedToDo(action, argument);

function askedToDo(action, argument) {

    argument = getThirdArgument();

    switch (action) {

        // List of Tweets
        case "my-tweets":
            getMyTweets();
            break;

        // Get song information
        case "spotify-this-song":

            // Song title
            var songTitle = argument;

            if (songTitle == "") {
                theDefaultSong();
            } else {
                chosenSong(songTitle);
            }
            break;

        // get movie info
        case "movie-this":

            // get movie Name argument
            var movieName = argument;

            // if the movie is not specified, display the movie "Mr.Nobody"
            if (movieName === "") {
                getDefaultMovie();
            } else {
                getUserMovie(movieName);
            }
            break;

        // Gets text inside file, and uses it to do something.
        case "write-it-down":
            writeItDown();
            break;
    }
}

// Returns optional third argument
function getThirdArgument() {

    // Stores all possible arguments in array.
    argumentArray = process.argv;

    // Loops through words in node argument.
    for (var i = 3; i < argumentArray.length; i++) {
        argument += argumentArray[i];
    }
    return argument;
}


// TWITTER

function getMyTweets() {
    console.log("inside of getMyTweets....");
    // Passes Twitter keys int o call to Twitter API.
    var user = new Twitter(keys.twitter);

    // Search for 20 tweets
    var parameters = {
        q: "@IlkovSamuil", count: 20
    };

    // Shows my tweets
    user.get("search/tweets", parameters, function (error, tweets, response) {
        console.log("we hit twitter!")
        if (!error) {
            // Loop through tweets and print them with date
            console.log("response: ", response)
            for (var i = 0; i < tweets.length; i++) {
                var tweetText = tweets.statuses[i].text;
                logOutput("Tweet Text: " + tweetText);
                var tweetDate = tweets.statuses[i].created_at;
                logOutput("Tweet creation Date: " + tweetDate);
            }
        } else {
            logOutput(error);
        }
    }
    )

}

// SPOTIFY

function chosenSong(songTitle) {
    var spotify = new Spotify(keys.spotify);

    // retrieve information about the song
    spotify.search({
        type: "track",
        query: songTitle
    },
        function (err, data) {
            if (err) {
                logOutput.error(err);
                return
            }
            var artistArray = data.tracks.items[0].album.artists;

            // Array to hold artist names
            var artistsNames = [];

            // Create an array to push the artists
            for (var i = 0; i < artistArray.length; i++) {
                artistName.push(artistArray[i].name);
            }
            // Converts artists array to string, and makes it understandable.
            var artists = artistsNames.join(", ");

            // Prints the information
            logOutput("Artist(s): " + artists);
            logOutput("Song: " + data.tracks.items[0].name)
            logOutput("Preview URL: " + data.tracks.items[0].preview_url)
            logOutput("Album Name: " + data.tracks.items[0].album.name);
        });
}

// Prints the default song "The Sign" by Ace of Base
function theDefaultSong() {
    var spotify = new Spotify(keys.spotify);
    spotify.search({ type: 'track', query: 'The Sign' }, function (err, data) {
        if (err) {
            logOutput(err);
            return
        }

        // Prints the artist, song name, preview link, and album name.
        console.log("data!", JSON.stringify(data));

        logOutput("Artist: " + data.artists[0].name);
        logOutput("Song: " + data.name);
        logOutput("Spotify Preview URL: " + data.preview_url);
        logOutput("Album Name: " + data.album.name);
    });
}

//  Display data for the movie requested by the user
function getUserMovie(movieName) {

    // run a request to the OMDB API
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {

        // if the request is successful 
        if (!error && response.statusCode === 200) {

            // Display info about the chosen Movie
            logOutput("Title: " + JSON.parse(body).Title + "\n" + "Year: " + JSON.parse(body).Year + "\n" +
                "IMDB Rating of the Movie: " + JSON.parse(body).imdbRating + "\n" + "Rotten Tomatoes Rating of the Movie " +
                JSON.parse(body).tomatoRating + "\n" + "Country where the Movie was produced: " + JSON.parse(body).Country + "\n" +
                "Language of the Movie: " + JSON.parse(body).Language + "\n" + "Plot of the Movie: " + JSON.parse(body).Plot +
                "\n" + "Actors in the Movie: " + JSON.parse(body).Actors);

        }
        else {

            //If the user doesn't request a specific movie, display data for the movie "Mr.Nobody"
            getDefaultMovie();
        }
    });
}

function getDefaultMovie() {
    var queryUrl = "http://www.omdbapi.com/?t=mr.nobody&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {

    logOutput("Title: " + JSON.parse(body).Title + "\n" + "Year: " + JSON.parse(body).Year + "\n" +
    "IMDB Rating of the Movie: " + JSON.parse(body).imdbRating + "\n" + "Rotten Tomatoes Rating of the Movie " +
    JSON.parse(body).tomatoRating + "\n" + "Country where the Movie was produced: " + JSON.parse(body).Country + "\n" +
    "Language of the Movie: " + JSON.parse(body).Language + "\n" + "Plot of the Movie: " + JSON.parse(body).Plot +
    "\n" + "Actors in the Movie: " + JSON.parse(body).Actors);
}else {
    console.log("Something is wrong.");
}
    })
};


// create log.txt file and console log the output
function writeItDown() {
    fs.readFile("log.txt", "utf8", function (err, data) {
        if (err) {
            logOutput(err);
        }
        else {

            // creates Array with data.
            var random = data.split(",");

            // sets action to first item in the array.
            action = random[0];

            // Sets optional third argument to second item in array.
            argument = random[1];

            // calls the function based on action and argument.
            writeItDown(action, argument);
        }
    });
}

// Logs data to the terminal and output to a text file.
function logOutput(logText) {
    log.info(logText);
    console.log(logText);
}
