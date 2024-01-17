import { DateTime } from "luxon";

const formatDate = (item: any, publisher: string): DateTime => {
  let dt = null;

  if (item.pubDate) {
    dt =item.pubDate;
    return DateTime.fromMillis(Date.parse(dt));
  }

  if (item["dc:date"]) {
    dt = item["dc:date"];
    return DateTime.fromISO(dt);
  }

  if (item["dc:created"]) {
    dt = item["dc:created"];
    return DateTime.fromISO(dt);
  }
  
  if (item.published){
    dt = item.published;
    return DateTime.fromISO(dt);
  }

  return DateTime.now();

}

export default formatDate;