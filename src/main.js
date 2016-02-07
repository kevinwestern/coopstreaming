'use strict';
var twitch_1 = require('./fetchers/twitch');
var twitch_2 = require('./transformers/twitch');
var ytgaming_1 = require('./fetchers/ytgaming');
var ytgaming_2 = require('./transformers/ytgaming');
const restler = require('../node_modules/restler');
const express = require('express');
const fs = require('fs');
const app = express();
const stringFetcher = (url, options) => {
    return new Promise((resolve, reject) => {
        restler.get(url, options).on('complete', (result, response) => {
            resolve(result);
        });
    });
};
const fetchFile = function (file) {
    return (url, options) => {
        return Promise.resolve(fs.readFileSync(file, 'utf8'));
    };
};
const ytgVideos = ytgaming_1.default.getLiveVideos({ fetch: fetchFile('mock_responses/yt.html') }).then(ytgaming_2.default);
const twitchVideos = twitch_1.default.getLiveVideos({ fetch: fetchFile('mock_responses/tw.json') }).then(twitch_2.default);
const home = Promise.all([ytgVideos, twitchVideos]);
const games = Promise.all([ytgVideos, twitchVideos]).then(arr => {
    const byGame = {};
    arr.forEach(streams => {
        streams.forEach(stream => {
            if (!stream.gameName) {
                return;
            }
            if (!byGame[stream.gameName]) {
                byGame[stream.gameName] = [];
            }
            byGame[stream.gameName].push(stream);
        });
    });
    return Object.keys(byGame).sort().map(gameName => {
        return { gameName, streams: byGame[gameName] };
    });
});
app.set('view engine', 'jade');
app.get('/', (req, res) => {
    home.then(arr => {
        res.render('index', { streams: arr[0].concat(arr[1]) });
    });
});
app.get('/games', (req, res) => {
    games.then(games => {
        res.render('games', { games });
    });
});
app.listen(3000, () => {
    console.log('listening on port 3000');
});
//# sourceMappingURL=main.js.map