'use strict';

/**
 * Fetches live streams from YTGaming.
 */

import {Fetcher} from '../lib/fetcher';

const YT_GAMING_LIVE_URL_:string = 'https://gaming.youtube.com/live'; 

function getLiveVideos(fetcher: Fetcher<string>): Promise<any> {
  return fetcher.fetch(YT_GAMING_LIVE_URL_, {
    headers: {
      "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"
    }
  }).then((data: string) => {
    let embeded = data.split("\n").find(line => line.indexOf('singleColumnBrowseResultsRenderer') != -1);
    if (!embeded) {
      console.error("No embeded response");
      return;
    }
    embeded = embeded.trim().replace('data: JSON.parse(', '');
    embeded = embeded.substring(0, embeded.length - 1);
    return JSON.parse(JSON.parse(embeded)).contents;
  });
};

export default {getLiveVideos}