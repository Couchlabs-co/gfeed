import { parse } from 'node-html-parser';
const he = require('he');

export default function getImage(item: any, publisher: string) {

    let imgSrc = "";
    let root;
    const getImageUrl = (url: string) => {
      const index = url.indexOf('?');
      return index > 0 ? url.slice(0, index) : url;
    };

    switch(publisher){
        case "Towards Data Science":
        case "The New Stack":
            root = parse(item.description ?? item["content:encoded"]);
            imgSrc = root.querySelector('img')?.getAttribute('src') ?? "";
            break;
        case "HACKERNOON":
            if(item.mediaThumbnail && item.mediaThumbnail.$ && item.mediaThumbnail.$.url){
              imgSrc = getImageUrl(item.mediaThumbnail.$.url.slice(23));
            } else{
              root = parse(item["content:encoded"]);
              imgSrc = root.querySelector('img')?.getAttribute('src') ?? "";
            }
            break;
        case "Financial Times":
            return item.mediaThumbnail.$.url;
        case "Martin Fowler":
            root = parse(he.decode(item.content["#text"]));
            return root.querySelector('img')?.getAttribute('src') ?? "";
        case "Sam Newman":
            root = parse(he.decode(item.content["#text"]));
            return `https://samnewman.io${root.querySelector('img')?.getAttribute('src') ?? ""}`;
        case "Alice GG":
            root = parse(item.description ?? item["content:encoded"]);
            imgSrc = he.decode(root.querySelector('img')?.getAttribute('src') ?? "");
            return `https://alicegg.tech${imgSrc}`;
        default:
            if (item['media:content'] && Array.isArray(item['media:content'])) {
                return item['media:content'][0]['@_url'];
              }
              if (item['media:content'] && !Array.isArray(item['media:content'])) {
                return item['media:content']['@_url'];
              }
              if (item['media:thumbnail']) {
                return item['media:thumbnail']['@_url'];
              }
              if (item.enclosure) {
                if(Array.isArray(item.enclosure)){
                  return getImageUrl(item.enclosure[0]['@_url']);
                }
                return getImageUrl(item.enclosure['@_url']);
              }
              if (item["content:encoded"]) {
                root = parse(item["content:encoded"]);
                const match = he.decode(root.querySelector('img')?.getAttribute('src') ?? "");
                return getImageUrl(match);
              }
              if (item.content && item.content["#text"]) {
                root= parse(item.content["#text"]);
                const match = he.decode(root.querySelector('img')?.getAttribute('src') ?? "");
                return getImageUrl(match);
              }
            
              if (item.description) {
                root = parse(item["description"]);
                const match = he.decode(root.querySelector('img')?.getAttribute('src') ?? "");
                return getImageUrl(match);
              }
    }

    return imgSrc;
  
    // if(publisher === "luk6xff tech blog") {
    //   return '';
    // }
  

  
    // if(publisher === "The New Stack" && item["content:encoded"]){
    //     const match = item["content:encoded"][0].match(/(<img.*)src\s*=\s*"(.+?)"/g)[0];
    //     return getImageUrl(match.slice(match.indexOf('src="')+5, match.length-1));
    // }
  
    // if (item["content:encoded"] && item["content:encoded"].match(/(<img.*)src\s*=\s*"(.+?)"/g)) {
    //   const match = he.decode(item["content:encoded"]).match(/(<img.*)src\s*=\s*"(.+?)"/g)[0];
    //   return getImageUrl(match.slice(match.indexOf('src="')+5, match.length-1));
    // }
  
    // if (item.content && item.content["#text"].match(/(<img.*)src\s*=\s*'(.+?)'/g) && publisher === "Martin Fowler") {
    //   const match = he.decode(item.content["#text"]).match(/(<img.*)src\s*=\s*'(.+?)'/g)[0];
    //   return getImageUrl(match.slice(match.indexOf("https"),match.length-1));
    // }
  
    // if (item.content && item.content["#text"] && publisher === "Sam Newman") {
    //   const match = he.decode(item.content["#text"]).match(/(<img.*)src\s*=\s*"(.+?)"/g);
    //   if(match){
    //     const imgPath = match[0].slice(match[0].indexOf('src="')+5, match[0].length-1);
    //     return `https://samnewman.io${imgPath}`;
    //   }
    //   return '';
    // }
  
    // if (item.content && item.content["#text"].match(/(<img.*)src\s*=\s*'(.+?)'/g)) {
    //   const match = he.decode(item.content["#text"]).match(/(<img.*)src\s*=\s*'(.+?)'/g)[0];
    //   return getImageUrl(match.slice(match.indexOf('src="')+5, match.length-1));
    // }
  
    // if (item.content && item.content["#text"] && item.content["#text"].match(/(<img.*)src\s*=\s*"(.+?)"/g)) {
    //   const match = he.decode(item.content["#text"]).match(/(<img.*)src\s*=\s*"(.+?)"/g)[0];
    //   return getImageUrl(match.slice(match.indexOf('src="')+5, match.length-1));
    // }
  
    // if (item.description && item.description.match(/(<img.*)src\s*=\s*"(.+?)"/g) && publisher === "Alice GG") {
    //   const match = he.decode(item["description"]).match(/(<img.*)src\s*=\s*"(.+?)"/g);
    //   if(match){
    //     const imgPath = match[0].slice(match[0].indexOf('src="')+5, match[0].length-1);
    //     return `https://alicegg.tech${imgPath}`;
    //   }
    //   return '';
    // }
  
    // if (item.description && item.description.match(/(<img.*)src\s*=\s*"(.+?)"/g)) {
    //   const match = he.decode(item["description"]).match(/(<img.*)src\s*=\s*"(.+?)"/g)[0];
    //   return getImageUrl(match.slice(match.indexOf('src="')+5, match.length-1));
    // }
  }