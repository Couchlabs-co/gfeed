import { DateTime } from "luxon";
import { parseISO, toDate } from 'date-fns';

const formatDate = (item: any, publisher: string): DateTime | String => {
  let dt = null;

  if (item.pubDate) {
    dt = Date.parse(item.pubDate);
    // return DateTime.fromMillis(Date.parse(dt));
    return toDate(dt).toISOString();
  }

  if (item["dc:date"]) {
    dt = Date.parse(item["dc:date"].trim());
    return toDate(dt).toISOString();
  }

  if (item["dc:created"]) {
    dt = Date.parse(item["dc:created"].trim());
    return toDate(dt).toISOString();
  }
  
  if (item.published){
    dt = Date.parse(item.published);
    return toDate(dt).toISOString();
  }

  if(item.updated){
    dt = Date.parse(item.updated);
    return toDate(dt).toISOString();
  }

  return DateTime.now();

}

export default formatDate;