export default function extractAuthor(item: any, publisher: string) {

    switch(publisher) {
      case "Overreacted":
        return "Dan Abramov";
      case "Martin Fowler":
        return "Martin Fowler";
      case "Alice GG":
        return "Alice Girard Guittard";
      case "Sam Newman":
        return "Sam Newman";
      case "DAN NORTH":
        return "Dan North";
      case "Financial Times":
        return "Financial Times";
      case "THE WALL STREET JOURNAL":
        return "THE WALL STREET JOURNAL";
      case "Hacker News":
        return "Hacker News";
      case "TokyoDev":
        return "Paul McMahon"
      case "Mitchell Hashimoto":
        return "Mitchell Hashimoto";
      case "Bloomberg Politics":
        if(item["dc:creator"]) {
          return item["dc:creator"];
        } else {
          return "Bloomberg";
        }
      case "A List Apart": {
        if(Array.isArray(item.author)){
          return item.author.map((author: any) => author.a["text"]).join(',');
        } else {
          return item.author.a["#text"];
        }
      }
      case "The Information": {
        if(Array.isArray(item.author)){
          return item.author.map((author: any) => author.name).join(',');
        } else {
          return item.author.name;
        }
      }
     default: {
      if(item["dc:creator"]) {
       return item["dc:creator"];
      }
      if(typeof item["author"] === "object") {
        return item["author"]["name"];
      }
      if(typeof item["author"] !== "string" && item["author"] !== undefined) {
        const author = item["author"][0]["a"].map((author: any) => {
          return author["_"];
        }).join(',');
        return author;
      }
      return item["author"] ? item["author"] : publisher;
     }
    }
  }