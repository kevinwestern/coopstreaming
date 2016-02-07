'use strict';

import twitchFetch from './fetchers/twitch';
import twitchTransform from './transformers/twitch';
import ytgfetch from './fetchers/ytgaming';
import ytgTransform from './transformers/ytgaming';
import {Options} from './lib/fetcher';

declare function require(name:string);
const restler = require('../node_modules/restler');
const express = require('express');
const fs = require('fs');
const app = express();

const stringFetcher = (url: string, options: Options): Promise<String> => {
  return new Promise<String>((resolve, reject) => {
    restler.get(url, options).on('complete', (result, response) => {
      resolve(result);
    })
  });
};

const fetchFile = function(file: string): any {
  return (url: string, options: Options): Promise<String> => {
    return Promise.resolve<string>(fs.readFileSync(file, 'utf8'));
  };
};

const ytgVideos = ytgfetch.getLiveVideos({fetch: fetchFile('mock_responses/yt.html')}).then(ytgTransform);
const twitchVideos = twitchFetch.getLiveVideos({fetch: fetchFile('mock_responses/tw.json')}).then(twitchTransform);
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
    return {gameName, streams: byGame[gameName]};
  });
});

app.set('view engine', 'jade');

app.get('/', (req, res) => {
  home.then(arr => {
    res.render('index', {streams: arr[0].concat(arr[1])});
  });
});

app.get('/games', (req, res) => {
  games.then(games => {
    res.render('games', {games});
  });
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});