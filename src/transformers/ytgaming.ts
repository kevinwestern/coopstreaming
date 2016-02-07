/**
 * Transforms the json return from the ytgaming fetch to something useful.
 */

export default function transform(data: any): Array<any> {
  const videos: Array<any> = data.singleColumnBrowseResultsRenderer.tabs[0].
    softTabRenderer.content.sectionListRenderer.contents[0].shelfRenderer.
    content.horizontalListRenderer.items;
  return videos.map(item => toVideo(item.gamingVideoRenderer));
};

function toVideo(renderer: any): any {
  return {
    source: 'ytg',
    thumbnails: toNamedSizes(renderer.thumbnail.thumbnails),
    title: renderer.title.runs[0].text,
    owner: renderer.shortBylineText.runs[0].text,
    viewers: renderer.shortViewCountText.runs[0].text,
    gameName: renderer.associatedGame ? renderer.associatedGame.gameDetailsRenderer.title.runs[0].text : null,
    watchUrl: `https://gaming.youtube.com/watch?v=${renderer.videoId}`
  };
};

function toNamedSizes(thumbnails: Array<any>): any {
  thumbnails = thumbnails.filter(thumbnail => {
    return thumbnail.width == 320 || thumbnail.width == 480 || thumbnail.width == 640
  });
  const toReturn: any = {};
  thumbnails.forEach(thumbnail => {
    switch (thumbnail.width) {
      case 320:
        toReturn.small = {
          url: thumbnail.url,
          width: thumbnail.width,
          height: thumbnail.height
        };
        break;
      case 480:
        toReturn.medium = {
          url: thumbnail.url,
          width: thumbnail.width,
          height: thumbnail.height
        };
        break;
      case 640:
        toReturn.large = {
          url: thumbnail.url,
          width: thumbnail.width,
          height: thumbnail.height
        };
        break;
    }
    // throw an error about an unknown size.
  });
  return toReturn;
};