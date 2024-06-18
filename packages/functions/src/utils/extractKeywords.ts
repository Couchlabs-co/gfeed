export default function extractKeywords(item: any, publisher: string) {
    let keywords = null;
    switch(publisher) {
      case "InfoWorld":
        keywords = item.categories.category;
        break;
      case "CoinDesk":
        keywords = Array.from(new Set(item.category.map((cat: any) => cat['#text']))).join(',');
        break;
      case "Overreacted":
        keywords = "React, JavaScript, Web Development, software development, programming";
        break;
      case "Martin Fowler":
        keywords = "software development, programming";
        break;
      case "The New York Times":
      case "Forbes":
      case "The Guardian":
      case "Lambda the Ultimate": 
        if(item.category && item.category.length > 1){
          keywords = item.category.map((cat: any) => cat["#text"]).join(',');
        }
        break;
      case "Bloomberg": {
        if(item.category){
          keywords = item.category["#text"];
        }
        break;
      }
      case "Damien Aicheh": {
        keywords = item.category.map((cat: any) => cat['@_term']).join(',');
        break;
      }
      case "The Wall Street Journal": {
        keywords = item['wsj:articletype'].trim();
        break;
      }
     default: {
      if(item.category && typeof item.category === "string"){
        keywords = item.category;
      }
      if(item.category && typeof item.category !== "string" && item.category.length > 1){
        keywords = item.category.map((cat: string) => cat).join(',');
      }
      if (item.categories && item.categories.length > 1 && typeof item.categories !== "string") {
        keywords = Array.from(new Set(item.categories.map((cat: string) => cat && cat.includes('/') ? cat.slice(cat.lastIndexOf('/')+1) : cat)
          .map((cat: string) => cat))).join(',');
      } else if (item.categories && typeof item.categories === "string") {
        keywords = item.categories;
      }
     }
    }
  
    return keywords;
  }