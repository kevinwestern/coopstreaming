'use strict';
const TWITCH_ENDPOINT_ = 'https://api.twitch.tv/kraken/streams';
function getLiveVideos(fetcher) {
    return fetcher.fetch(TWITCH_ENDPOINT_, {
        headers: {
            "Accept": "application/vnd.twitchtv.v3+json"
        }
    }).then((data) => {
        // pls fix later
        if (typeof data == 'string') {
            return JSON.parse(data);
        }
        return data;
    });
}
;
exports.default = { getLiveVideos };
//# sourceMappingURL=twitch.js.map