const SIZES_ = [{
        name: 'small',
        width: 320,
        height: 180
    }, {
        name: 'medium',
        width: 480,
        height: 360
    }, {
        name: 'large',
        width: 640,
        height: 480
    }];
function transform(data) {
    return data.streams.map(fromStream);
}
exports.default = transform;
const fromStream = stream => {
    return {
        source: 'twitch',
        thumbnails: createThumbnails(stream.preview.template),
        title: stream.channel.status,
        owner: stream.channel.display_name,
        viewers: stream.viewers,
        gameName: stream.channel.game,
        watchUrl: stream.channel.url
    };
};
const createThumbnails = template => {
    const thumbnails = {};
    SIZES_.map(size => {
        thumbnails[size.name] = {
            url: template.replace('{width}', size.width).replace('{height}', size.height),
            width: size.width,
            height: size.height
        };
    });
    return thumbnails;
};
//# sourceMappingURL=twitch.js.map