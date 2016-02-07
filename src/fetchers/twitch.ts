'use strict';

/**
 * Fetches live streams from Twitch.
 */

import {Fetcher} from '../lib/fetcher';

const TWITCH_ENDPOINT_:string = 'https://api.twitch.tv/kraken/streams'; 

function getLiveVideos(fetcher: Fetcher<string>): Promise<any> {
  return fetcher.fetch(TWITCH_ENDPOINT_, {
    headers: {
      "Accept": "application/vnd.twitchtv.v3+json"
    }
  }).then((data: string) => {
    // pls fix later
    if (typeof data == 'string') {
      return JSON.parse(data);
    }
    return data;
  });
};

export default {getLiveVideos}