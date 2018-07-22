# liri-node-app

LIRI is a Language Interpretation and Recognition Interface. Use LIRI to get your latest tweets, find out about a song, or a movie, or just choose a random action from your own random file.

INSTALLS:
The package.json lists dependent node packages, but for your convenvice, these are the ones to install.

Twitter:
npm install twitter

Spotify:
npm instal spotify

Request:
npm install request

FS:
npm install fs

COMMANDS:

Get Tweets
Retrieves up to your latest 20 tweets:

node liri.js my-tweets

Get Song Info
Retrieves song information for a track:

node liri.js spotify-this-song "-----"

Get Movie Info
Retrieves movie information for a movie:

node liri.js movie-this "-----"

Get Random Info
Gets random text inside a file and does what it says:

node liri.js write-it-down

