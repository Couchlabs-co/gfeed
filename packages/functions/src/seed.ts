import { dbClient } from "./utils/dbClient";
import { PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { v4 } from "uuid";

const publishers = [
  {
    "name": "Overreacted",
    "payWall": false,
    "publisherUrl": "https://overreacted.io/",
    "feedUrl": "https://overreacted.io/rss.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "6 hours"
  },
  {
    "name": "A List Apart",
    "payWall": false,
    "publisherUrl": "https://alistapart.com/",
    "feedUrl": "https://alistapart.com/main/feed/",
    "isActive": "inactive-inactive",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "6 hours"
  },
  {
    "name": "Alice GG",
    "payWall": false,
    "publisherUrl": "https://alicegg.tech/",
    "feedUrl": "https://alicegg.tech/feed.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "6 hours"
  },
  {
    "name": "VentureBeat",
    "payWall": false,
    "publisherUrl": "https://venturebeat.com/",
    "feedUrl": "http://feeds.feedburner.com/venturebeat/SZYF",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://venturebeat.com/wp-content/themes/vb-news/img/favicon.ico" //https://venturebeat.com/wp-content/themes/vb-news/brand/img/logos/VB_Extended_Logo_40H.png
  },
  {
    "name": "Joel on Software",
    "payWall": false,
    "publisherUrl": "https://www.joelonsoftware.com/",
    "feedUrl": "https://www.joelonsoftware.com/feed/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://i0.wp.com/www.joelonsoftware.com/wp-content/uploads/2016/12/11969842.jpg?fit=32%2C32&#038;ssl=1"
  },
  {
    "name": "Sam Newman",
    "payWall": false,
    "publisherUrl": "https://samnewman.io/",
    "feedUrl": "https://samnewman.io/blog/feed.xml",
    "isActive": "active",
    "feedType": "atom",
    "primaryTag": "Tech",
    "frequency": "6 hours"
  },
  {
    "name": "Mozilla Hacks",
    "payWall": false,
    "publisherUrl": "https://hacks.mozilla.org/",
    "feedUrl": "https://hacks.mozilla.org/feed/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "6 hours"
  },
  {
    "name": "HACKERNOON",
    "payWall": false,
    "publisherUrl": "https://hackernoon.com/",
    "feedUrl": "https://hackernoon.com/feed",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://hackernoon.com/favicon.ico"
  },
  {
    "name": "TechCrunch",
    "payWall": false,
    "publisherUrl": "https://www.techcrunch.com/",
    "feedUrl": "https://www.techcrunch.com/feed",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png?w=32"
  },
  {
    "name": "Martin Fowler",
    "payWall": false,
    "publisherUrl": "https://martinfowler.com/",
    "feedUrl": "https://martinfowler.com/feed.atom",
    "isActive": "active",
    "feedType": "atom",
    "primaryTag": "Tech",
    "frequency": "6 hours"
  },
  {
    "name": "DAN NORTH",
    "payWall": false,
    "publisherUrl": "https://dannorth.net/",
    "feedUrl": "https://dannorth.net/blog/index.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "6 hours"
  },
  {
    "name": "Coding Horror",
    "payWall": false,
    "publisherUrl": "https://blog.codinghorror.com/",
    "feedUrl": "https://blog.codinghorror.com/rss/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://blog.codinghorror.com/favicon.png"
  },
  {
    "name": "Jacob Singh",
    "payWall": false,
    "publisherUrl": "https://jacobsingh.name/",
    "feedUrl": "https://jacobsingh.name/rss/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://jacobsingh.name/favicon.png"
  },
  {
    "name": "Game Developer",
    "payWall": false,
    "publisherUrl": "https://www.gamedeveloper.com/",
    "feedUrl": "https://www.gamedeveloper.com/rss.xml",
    "isActive": "inactive-permanently",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://www.gamedeveloper.com/images/GD_official_logo.png"
  },
  {
    "name": "the HUSTLE",
    "payWall": false,
    "publisherUrl": "https://thehustle.co/",
    "feedUrl": "https://thehustle.co/feed/",
    "isActive": "permanently-Inactive",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://thehustle.co/wp-content/uploads/2022/04/cropped-favicon-32x32.png"
  },
  {
    "name": "Software Engineering Tidbits",
    "payWall": false,
    "publisherUrl": "https://www.softwareengineeringtidbits.com/",
    "feedUrl": "https://www.softwareengineeringtidbits.com/feed",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "6 hours"
  },
  {
    "name": "The Pragmatic Engineer",
    "payWall": false,
    "publisherUrl": "https://blog.pragmaticengineer.com/",
    "feedUrl": "https://feeds.feedburner.com/ThePragmaticEngineer",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://substackcdn.com/image/fetch/w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F5ecbf7ac-260b-423b-8493-26783bf01f06_600x600.png"
  },
  {
    "name": "Musings Of A Caring Techie",
    "payWall": false,
    "publisherUrl": "https://www.thecaringtechie.com/",
    "feedUrl": "https://www.thecaringtechie.com/feed",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://substackcdn.com/image/fetch/w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Fdf5b345b-fff0-4b91-a3d6-9e394fda0510_1280x1280.png"
  },
  {
    "name": "Dev Interrupted",
    "payWall": false,
    "publisherUrl": "https://devinterrupted.com/",
    "feedUrl": "https://devinterrupted.substack.com/feed",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://substackcdn.com/image/fetch/w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Feff814ba-ca84-4452-a48d-789e87a955bd_750x750.png"
  },
  {
    "name": "The LeadTech Diet",
    "payWall": false,
    "publisherUrl": "https://leonardoborges.substack.com/",
    "feedUrl": "https://leonardoborges.substack.com/feed",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://substackcdn.com/image/fetch/w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F626b16c4-f791-49ce-ae0b-33549f8407f2_214x214.png"
  },
  {
    "name": "The Developing Dev",
    "payWall": false,
    "publisherUrl": "https://www.developing.dev/",
    "feedUrl": "https://www.developing.dev/feed",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://substackcdn.com/image/fetch/w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffb980aa1-65a4-4e90-aacb-fc07a563b5f7_500x500.png"
  },
  {
    "name": "Frontend Engineering",
    "payWall": false,
    "publisherUrl": "https://frontendengineering.substack.com/",
    "feedUrl": "https://frontendengineering.substack.com/feed",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://substackcdn.com/image/fetch/w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fae9cb9cd-5e76-4b86-9942-7ac5aa9891ea_256x256.png"
  },
  {
    "name": "Financial Times",
    "payWall": true,
    "publisherUrl": "https://www.ft.com/",
    "feedUrl": "https://www.ft.com/rss/home",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Business",
    "frequency": "6 hours"
  },
  {
    "name": "CoinDesk",
    "payWall": false,
    "publisherUrl": "https://www.coindesk.com/",
    "feedUrl": "https://www.coindesk.com/arc/outboundfeeds/rss",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Crypto",
    "frequency": "3 hours",
    "logo": "https://www.coindesk.com/resizer/fTK3gATlyciJ-BZG2_OP12niDe0=/144x32/downloads.coindesk.com/arc/failsafe/feeds/coindesk-feed-logo.png"
  },
  {
    "name": "The Wall Street Journal",
    "payWall": true,
    "publisherUrl": "https://www.wsj.com",
    "feedUrl": "https://feeds.a.dj.com/rss/RSSWSJD.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo":"http://online.wsj.com/img/wsj_sm_logo.gif"
  },
  {
    "name": "The Wall Street Journal",
    "payWall": true,
    "publisherUrl": "https://www.wsj.com",
    "feedUrl": "https://feeds.a.dj.com/rss/RSSLifestyle.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "LifeStyle",
    "frequency": "3 hours",
    "logo":"http://online.wsj.com/img/wsj_sm_logo.gif"
  },
  {
    "name": "The Wall Street Journal",
    "payWall": true,
    "publisherUrl": "https://www.wsj.com",
    "feedUrl": "https://feeds.a.dj.com/rss/RSSOpinion.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Misc",
    "frequency": "3 hours",
    "logo":"http://online.wsj.com/img/wsj_sm_logo.gif"
  },
  {
    "name": "FAST COMPANY",
    "payWall": false,
    "publisherUrl": "https://www.fastcompany.com",
    "feedUrl": "https://www.fastcompany.com/latest/rss?truncated=true",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "LifeStyle",
    "frequency": "3 hours",
    "logo":"https://www.fastcompany.com/asset_files/static/logos/fastcompany/fc-fb-icon_big.png"
  },
  {
    "name": "FAST COMPANY",
    "payWall": false,
    "publisherUrl": "https://www.fastcompany.com",
    "feedUrl": "https://www.fastcompany.com/technology/rss",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo":"https://www.fastcompany.com/asset_files/static/logos/fastcompany/fc-fb-icon_big.png"
  },
  {
    "name": "Axios",
    "payWall": false,
    "publisherUrl": "https://www.axios.com",
    "feedUrl": "https://www.axios.com/technology",
    "isActive": "inactive-inactive",
    "feedType": "html",
    "primaryTag": "News",
    "frequency": "6 hours"
  },
  {
    "name": "The New York Times",
    "payWall": false,
    "publisherUrl": "https://www.nytimes.com",
    "feedUrl": "http://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "World",
    "frequency": "3 hours",
    "logo": "https://static01.nyt.com/images/misc/NYT_logo_rss_250x40.png"
  },
  {
    "name": "Washington Post",
    "payWall": false,
    "publisherUrl": "https://www.washingtonpost.com",
    "feedUrl": "https://feeds.washingtonpost.com/rss/world",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "World",
    "frequency": "6 hours"
  },
  {
    "name": "The Guardian",
    "payWall": false,
    "publisherUrl": "https://www.theguardian.com",
    "feedUrl": "https://www.theguardian.com/world/rss",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "World",
    "frequency": "3 hours",
    "logo": "https://assets.guim.co.uk/images/guardian-logo-rss.c45beb1bafa34b347ac333af2e6fe23f.png"
  },
  {
    "name": "The Information",
    "payWall": false,
    "publisherUrl": "https://www.theinformation.com",
    "feedUrl": "https://www.theinformation.com/feed",
    "isActive": "permanently-Inactive",
    "feedType": "atom",
    "primaryTag": "World",
    "frequency": "3 hours",
    "logo": "https://ti-assets.theinformation.com/packs/static/assets/images/logo-61c5f316408817d61af5.png"
  },
  {
    "name": "Hacker News",
    "payWall": false,
    "publisherUrl": "https://news.ycombinator.com",
    "feedUrl": "https://hnrss.org/frontpage",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://news.ycombinator.com/y18.svg"
  },
  {
    "name": "Hacker News",
    "payWall": false,
    "publisherUrl": "https://news.ycombinator.com",
    "feedUrl": "https://hnrss.org/newest",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://news.ycombinator.com/y18.svg"
  },
  {
    "name": "Damien Aicheh",
    "payWall": false,
    "publisherUrl": "https://damienaicheh.github.io",
    "feedUrl": "https://damienaicheh.github.io/feed.xml",
    "isActive": "perm-Inactive",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://damienaicheh.github.io/assets/img/logo_circle.svg"
  },
  {
    "name": "Ars Technica",
    "payWall": false,
    "publisherUrl": "https://arstechnica.com",
    "feedUrl": "https://feeds.arstechnica.com/arstechnica/index",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://cdn.arstechnica.net/wp-content/uploads/2016/10/cropped-ars-logo-512_480-32x32.png"
  },
  {
    "name": "TokyoDev",
    "payWall": false,
    "publisherUrl": "https://www.tokyodev.com",
    "feedUrl": "https://www.tokyodev.com/atom.xml",
    "isActive": "active",
    "feedType": "atom",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "Mitchell Hashimoto",
    "payWall": false,
    "publisherUrl": "https://mitchellh.com",
    "feedUrl": "https://mitchellh.com/feed.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "FotMob",
    "payWall": false,
    "publisherUrl": "https://www.fotmob.com",
    "feedUrl": "https://pub.fotmob.com/prod/news/api/rss/world",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Sports",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "CaughtOffside",
    "payWall": false,
    "publisherUrl": "https://www.caughtoffside.com",
    "feedUrl": "https://www.caughtoffside.com/feed/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Sports",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "Yahoo",
    "payWall": false,
    "publisherUrl": "https://sports.yahoo.com/",
    "feedUrl": "https://sports.yahoo.com/rss/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Sports",
    "frequency": "3 hours",
    "logo": "http://l.yimg.com/rz/d/yahoo_sports_en-US_s_f_p_182x21_sports.gif"
  },
  {
    "name": "The New York Times",
    "payWall": false,
    "publisherUrl": "https://nytimes.com/",
    "feedUrl": "https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Sports",
    "frequency": "3 hours",
    "logo": "https://static01.nyt.com/images/misc/NYT_logo_rss_250x40.png"
  },
  {
    "name": "Washington Post",
    "payWall": false,
    "publisherUrl": "https://www.washingtonpost.com",
    "feedUrl": "https://feeds.washingtonpost.com/rss/opinions",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Politics",
    "frequency": "3 hours",
    "logo": "https://static01.nyt.com/images/misc/NYT_logo_rss_250x40.png"
  },
  {
    "name": "The New York Times",
    "payWall": false,
    "publisherUrl": "https://www.nytimes.com/ca/section/politic",
    "feedUrl": "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Politics",
    "frequency": "3 hours",
    "logo": "https://static01.nyt.com/images/misc/NYT_logo_rss_250x40.png"
  },
  {
    "name": "HuffPost",
    "payWall": false,
    "publisherUrl": "https://www.huffpost.com/news/politics",
    "feedUrl": "https://www.huffpost.com/section/politics/feed",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Politics",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "InfoQ",
    "payWall": false,
    "publisherUrl": "https://www.infoq.com",
    "feedUrl": "https://feed.infoq.com",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "Forbes",
    "payWall": false,
    "publisherUrl": "https://www.forbes.com",
    "feedUrl": "https://feeds.forbes.com/sportsmoney/feed/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Sports",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "Forbes",
    "payWall": false,
    "publisherUrl": "https://www.forbes.com",
    "feedUrl": "https://feeds.forbes.com/business/feed/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Business",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "Forbes",
    "payWall": false,
    "publisherUrl": "https://www.forbes.com",
    "feedUrl": "https://feeds.forbes.com/lifestyle/feed/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "LifeStyle",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "Forbes",
    "payWall": false,
    "publisherUrl": "https://www.forbes.com",
    "feedUrl": "https://feeds.forbes.com/travel/feed/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Travel",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "Forbes",
    "payWall": false,
    "publisherUrl": "https://www.forbes.com",
    "feedUrl": "https://feeds.forbes.com/food-drink/feed/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Food",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "Forbes",
    "payWall": false,
    "publisherUrl": "https://www.forbes.com",
    "feedUrl": "https://feeds.forbes.com/digital-assets/feed/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Crypto",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "The New Yorker",
    "payWall": false,
    "publisherUrl": "https://www.newyorker.com",
    "feedUrl": "https://www.newyorker.com/feed/culture",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Culture",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "The New Stack",
    "payWall": false,
    "publisherUrl": "https://www.thenewstack.io",
    "feedUrl": "https://www.thenewstack.io/blog/feed",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "formula1.com",
    "payWall": false,
    "publisherUrl": "https://formula1.com",
    "feedUrl": "https://formula1.com/en/latest/all.xml",
    "isActive": "permanently-Inactive",
    "feedType": "xml",
    "primaryTag": "Sports",
    "frequency": "3 hours",
    "logo": "https://formula1.com/etc/designs/fom-website/images/svg/f1-brand-logo.svg"
  },
  {
    "name": "Human Who Codes",
    "payWall": false,
    "publisherUrl": "https://humanwhocodes.com",
    "feedUrl": "https://humanwhocodes.com/feeds/blog.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://humanwhocodes.com/_astro/logo-full-web.fbbbde18.svg"
  },
  {
    "name": "The T-Shaped Dev",
    "payWall": false,
    "publisherUrl": "https://thetshaped.dev",
    "feedUrl": "https://thetshaped.dev/feed",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://substackcdn.com/image/fetch/w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7f66bb7c-c96f-4c71-ba2d-d561152c83a2_600x600.png"
  },
  {
    "name": "Microsoft Security Response Center",
    "payWall": false,
    "publisherUrl": "https://msrc.microsoft.com",
    "feedUrl": "https://msrc.microsoft.com/blog/feed",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "Uber Blog",
    "payWall": false,
    "publisherUrl": "https://www.uber.com",
    "feedUrl": "https://www.uber.com/en-AU/blog/engineering/rss/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "Zero Day Initiative",
    "payWall": false,
    "publisherUrl": "https://www.thezdi.com",
    "feedUrl": "https://www.zerodayinitiative.com/blog?format=rss",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "darkreading",
    "payWall": false,
    "publisherUrl": "https://www.darkreading.com",
    "feedUrl": "https://www.darkreading.com/rss.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "The CyberWire",
    "payWall": false,
    "publisherUrl": "https://thecyberwire.com",
    "feedUrl": "https://thecyberwire.com/feeds/rss.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "WIRED",
    "payWall": false,
    "publisherUrl": "https://www.wired.com",
    "feedUrl": "https://www.wired.com/feed/tag/ai/latest/rss",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "WIRED",
    "payWall": false,
    "publisherUrl": "https://www.wired.com",
    "feedUrl": "https://www.wired.com/feed/category/business/latest/rss",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Business",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "WIRED",
    "payWall": false,
    "publisherUrl": "https://www.wired.com",
    "feedUrl": "https://www.wired.com/feed/category/science/latest/rss",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Science",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "WIRED",
    "payWall": false,
    "publisherUrl": "https://www.wired.com",
    "feedUrl": "https://www.wired.com/feed/category/culture/latest/rss",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Culture",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "WIRED",
    "payWall": false,
    "publisherUrl": "https://www.wired.com",
    "feedUrl": "https://www.wired.com/feed/category/security/latest/rss",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "luk6xff tech blog",
    "payWall": false,
    "publisherUrl": "https://luk6xff.github.io",
    "feedUrl": "https://luk6xff.github.io/rss.xml",
    "isActive": "Inactive - Inactive",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "Digiday",
    "payWall": false,
    "publisherUrl": "https://digiday.com",
    "feedUrl": "https://digiday.com/feed/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Business",
    "frequency": "3 hours",
    "logo": "https://digiday.com/wp-content/uploads/sites/3/2020/11/mstile-310x310-1.png?w=32"
  },
  {
    "name": "MachineLearningMastery.com",
    "payWall": false,
    "publisherUrl": "https://machinelearningmastery.com",
    "feedUrl": "https://machinelearningmastery.com/feed/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://machinelearningmastery.com/wp-content/uploads/2016/09/cropped-icon-32x32.png"
  },
  {
    "name": "FlowingData",
    "payWall": false,
    "publisherUrl": "https://flowingdata.com",
    "feedUrl": "https://flowingdata.com/feed",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://i0.wp.com/flowingdata.com/wp-content/uploads/2014/10/logo-lone-square-600-5451c585_site_icon.png?fit=32%2C32&#038;ssl=1"
  },
  {
    "name": "Towards Data Science",
    "payWall": false,
    "publisherUrl": "https://towardsdatascience.com",
    "feedUrl": "https://towardsdatascience.com/feed?path=%2Fdiscover%2Ftopic%2Ftech-news-trends%2Fdata-science-ml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://cdn-images-1.medium.com/proxy/1*TGH72Nnw24QL3iV9IOm4VA.png"
  },
  {
    "name": "Reddit",
    "payWall": false,
    "publisherUrl": "https://www.reddit.com",
    "feedUrl": "https://www.reddit.com/r/MachineLearning/.rss?path=%2Fdiscover%2Ftopic%2Ftech-news-trends%2Fdata-science-ml",
    "isActive": "perma-Inactive",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://www.redditstatic.com/icon.png"
  },
  {
    "name": "Reddit",
    "payWall": false,
    "publisherUrl": "https://www.reddit.com",
    "feedUrl": "https://www.reddit.com/r/programming.rss",
    "isActive": "perma-Inactive",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://b.thumbs.redditmedia.com/2rTE46grzsr-Ll3Q.png"
  },
  {
    "name": "RBloggers",
    "payWall": false,
    "publisherUrl": "https://www.r-bloggers.com",
    "feedUrl": "https://feeds.feedburner.com/RBloggers?path=%2Fdiscover%2Ftopic%2Ftech-news-trends%2Fdata-science-ml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://i0.wp.com/www.r-bloggers.com/wp-content/uploads/2016/08/cropped-R_single_01-200.png?fit=32%2C32&ssl=1"
  },
  {
    "name": "The Next Web",
    "payWall": false,
    "publisherUrl": "https://thenextweb.com",
    "feedUrl": "https://thenextweb.com/feed",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "The Daily WTF",
    "payWall": false,
    "publisherUrl": "http://thedailywtf.com/",
    "feedUrl": "https://feeds.feedburner.com/TheDailyWtf?path=%2Fdiscover%2Ftopic%2Ftech-news-trends%2Fprogramming",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "Lambda the Ultimate",
    "payWall": false,
    "publisherUrl": "http://lambda-the-ultimate.org",
    "feedUrl": "http://lambda-the-ultimate.org/rss.xml?path=%2Fdiscover%2Ftopic%2Ftech-news-trends%2Fprogramming",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "BBC Sport",
    "payWall": false,
    "publisherUrl": "https://www.bbc.co.uk/sport",
    "feedUrl": "https://feeds.bbci.co.uk/sport/rss.xml?path=%2Fdiscover%2Ftopic%2Fsports",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Sports",
    "frequency": "3 hours",
    "logo": "http://news.bbc.co.uk/sol/shared/img/sport_120x60.gif"
  },
  {
    "name": "The Guardian",
    "payWall": false,
    "publisherUrl": "https://www.theguardian.com",
    "feedUrl": "https://feeds.theguardian.com/theguardian/football/rss?path=%2Fdiscover%2Ftopic%2Fsports%2Ffootball",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Sports",
    "frequency": "3 hours",
    "logo": "https://assets.guim.co.uk/images/guardian-logo-rss.c45beb1bafa34b347ac333af2e6fe23f.png"
  },
  {
    "name": "MarketWatch",
    "payWall": false,
    "publisherUrl": "https://www.marketwatch.com",
    "feedUrl": "https://feeds.content.dowjones.io/public/rss/mw_topstories",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Business",
    "frequency": "3 hours",
    "logo": "https://www.marketwatch.com/rss/marketwatch.gif"
  },
  {
    "name": "NPR",
    "payWall": false,
    "publisherUrl": "https://npr.org",
    "feedUrl": "https://feeds.npr.org/15709577/rss.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Entertainment",
    "frequency": "3 hours",
    "logo": "https://media.npr.org/images/podcasts/primary/npr_generic_image_300.jpg?s=200"
  },
  {
    "name": "Rolling Stone",
    "payWall": false,
    "publisherUrl": "https://www.rollingstone.com",
    "feedUrl": "https://www.rollingstone.com/feed",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Entertainment",
    "frequency": "3 hours",
    "logo": "https://www.rollingstone.com/wp-content/uploads/2022/08/cropped-Rolling-Stone-Favicon.png?w=32"
  },
  {
    "name": "Mens Health Australia",
    "payWall": false,
    "publisherUrl": "https://menshealth.com.au",
    "feedUrl": "https://menshealth.com.au/feed/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Health",
    "frequency": "3 hours",
    "logo": "https://menshealth.com.au/wp-content/uploads/2021/12/cropped-Mens-Health-32x32.jpeg"
  },
  {
    "name": "Womens Health Australia",
    "payWall": false,
    "publisherUrl": "https://womenshealth.com.au",
    "feedUrl": "https://womenshealth.com.au/feed/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Health",
    "frequency": "3 hours",
    "logo": "https://womenshealth.com.au/wp-content/uploads/2021/10/cropped-WH_LOGO_SHORT-32x32.jpg"
  },
  {
    "name": "Health & WellBeing",
    "payWall": false,
    "publisherUrl": "https://www.wellbeing.com.au",
    "feedUrl": "https://www.wellbeing.com.au/body/health/feed",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Health",
    "frequency": "3 hours",
    "logo": "https://da28rauy2a860.cloudfront.net/wellbeing/wp-content/uploads/2021/11/16150900/Wellbeing_32x32-.png"
  },
  {
    "name": "Moneycontrol",
    "payWall": false,
    "publisherUrl": "https://www.moneycontrol.com",
    "feedUrl": "https://www.moneycontrol.com/rss/MCtopnews.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Business",
    "frequency": "3 hours",
    "logo": "http://img1.moneycontrol.com/images/top2010/moneycontrol_logo.jpg"
  },
  {
    "name": "Capitalmind",
    "payWall": false,
    "publisherUrl": "https://www.capitalmind.in",
    "feedUrl": "https://www.capitalmind.in/rss",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Business",
    "frequency": "3 hours",
    "logo": "https://capitalmind.in/images/web_cmwealth.png"
  },
  {
    "name": "Business Today",
    "payWall": false,
    "publisherUrl": "https://www.businesstoday.in",
    "feedUrl": "https://www.businesstoday.in/rssfeeds/?id=home",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Business",
    "frequency": "3 hours",
    "logo": "https://akm-img-a-in.tosshub.com/businesstoday/resource/img/logo.png"
  },
  {
    "name": "Mint",
    "payWall": false,
    "publisherUrl": "https://www.livemint.com",
    "feedUrl": "https://www.livemint.com/rss/money",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Business",
    "frequency": "3 hours",
    "logo": ""
  },
  {
    "name": "Bloomberg",
    "payWall": true,
    "publisherUrl": "https://www.bloomberg.com",
    "feedUrl": "https://feeds.bloomberg.com/wealth/news.rss",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Business",
    "frequency": "3 hours",
    "logo": "https://www.bloomberg.com/feeds/static/images/bloomberg_logo_blue.png"
  },
  {
    "name": "Bloomberg",
    "payWall": true,
    "publisherUrl": "https://www.bloomberg.com",
    "feedUrl": "https://feeds.bloomberg.com/technology/news.rss",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Business",
    "frequency": "3 hours",
    "logo": "https://www.bloomberg.com/feeds/static/images/bloomberg_logo_blue.png"
  },
  {
    "name": "Bloomberg",
    "payWall": true,
    "publisherUrl": "https://www.bloomberg.com",
    "feedUrl": "https://feeds.bloomberg.com/politics/news.rss",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Politics",
    "frequency": "3 hours",
    "logo": "https://www.bloomberg.com/feeds/static/images/bloomberg_logo_blue.png"
  },
  {
    "name": "Bloomberg",
    "payWall": true,
    "publisherUrl": "https://www.bloomberg.com",
    "feedUrl": "https://www.bloomberg.com/authors/AU41Fx3I-rM/bloomberg-opinion.rss",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Misc",
    "frequency": "3 hours",
    "logo": "https://www.bloomberg.com/feeds/static/images/bloomberg_logo_black.png"
  },
  {
    "name": "The Economist",
    "payWall": true,
    "publisherUrl": "https://www.economist.com",
    "feedUrl": "https://www.economist.com/business/rss.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Business",
    "frequency": "3 hours",
    "logo": "https://www.economist.com/sites/all/themes/econfinal/images/svg/logo.svg"
  },
  {
    "name": "The Economist",
    "payWall": true,
    "publisherUrl": "https://www.economist.com",
    "feedUrl": "https://www.economist.com/finance-and-economics/rss.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Business",
    "frequency": "3 hours",
    "logo": "https://www.economist.com/sites/all/themes/econfinal/images/svg/logo.svg"
  },
  {
    "name": "The Economist",
    "payWall": true,
    "publisherUrl": "https://www.economist.com",
    "feedUrl": "https://www.economist.com/science-and-technology/rss.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Science",
    "frequency": "3 hours",
    "logo": "https://www.economist.com/sites/all/themes/econfinal/images/svg/logo.svg"
  },
  {
    "name": "GeekWire",
    "payWall": false,
    "publisherUrl": "https://www.geekwire.com",
    "feedUrl": "https://www.geekwire.com/startups/feed/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "3 hours",
    "logo": "https://www.geekwire.com/wp-content/themes/geekwire/dist/images/geekwire-logo-rss.png"
  },
  {
    "name": "GeekWire",
    "payWall": false,
    "publisherUrl": "https://www.geekwire.com",
    "feedUrl": "https://www.geekwire.com/sports/feed/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Sports",
    "frequency": "3 hours",
    "logo": "https://www.geekwire.com/wp-content/themes/geekwire/dist/images/geekwire-logo-rss.png"
  },
  {
    "name": "GeekWire",
    "payWall": false,
    "publisherUrl": "https://www.geekwire.com",
    "feedUrl": "https://www.geekwire.com/science/feed/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Science",
    "frequency": "3 hours",
    "logo": "https://www.geekwire.com/wp-content/themes/geekwire/dist/images/geekwire-logo-rss.png"
  },
  {
    "name": "Ed Zitron's Where's Your Ed At",
    "payWall": false,
    "publisherUrl": "https://www.wheresyoured.at",
    "feedUrl": "https://www.wheresyoured.at/rss/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "24 hours",
    "logo": "https://www.wheresyoured.at/favicon.png"
  },
  {
    "name": "Verve Magazine",
    "payWall": false,
    "publisherUrl": "https://www.vervemagazine.in",
    "feedUrl": "https://feeds.feedburner.com/vervemagazine/ilGx",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Entertainment",
    "frequency": "6 hours",
    "logo": "https://www.vervemagazine.in/wp-content/uploads/2014/01/cropped-Untitled-1-32x32.png"
  },
  {
    "name": "CineBlitz",
    "payWall": false,
    "publisherUrl": "https://cineblitz.in/",
    "feedUrl": "https://cineblitz.in/feed/",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Entertainment",
    "frequency": "6 hours",
    "logo": ""
  },
  {
    "name": "Netflix Technology Blog",
    "payWall": true,
    "publisherUrl": "https://medium.com/@netflixtechblog?source=rss-c3aeaf49d8a4------2",
    "feedUrl": "https://medium.com/feed/@netflixtechblog",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Entertainment",
    "frequency": "24 hours",
    "logo": "https://cdn-images-1.medium.com/fit/c/150/150/1*BJWRqfSMf9Da9vsXG9EBRQ.jpeg"
  },
  {
    "name": "Medium",
    "payWall": true,
    "publisherUrl": "https://medium.com",
    "feedUrl": "https://medium.com/feed/tag/technology",
    "isActive": "Inactive",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "6 hours",
    "logo": "https://cdn-images-1.medium.com/proxy/1*TGH72Nnw24QL3iV9IOm4VA.png"
  },
  {
    "name": "Medium",
    "payWall": true,
    "publisherUrl": "https://medium.com",
    "feedUrl": "https://medium.com/feed/tag/artificial-intelligence",
    "isActive": "Inactive",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "6 hours",
    "logo": "https://cdn-images-1.medium.com/proxy/1*TGH72Nnw24QL3iV9IOm4VA.png"
  },
  {
    "name": "Medium",
    "payWall": true,
    "publisherUrl": "https://medium.com",
    "feedUrl": "https://medium.com/feed/tag/machine-learning",
    "isActive": "Inactive",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "6 hours",
    "logo": "https://cdn-images-1.medium.com/proxy/1*TGH72Nnw24QL3iV9IOm4VA.png"
  },
  {
    "name": "Medium",
    "payWall": true,
    "publisherUrl": "https://medium.com",
    "feedUrl": "https://medium.com/feed/tag/ai",
    "isActive": "Inactive",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "6 hours",
    "logo": "https://cdn-images-1.medium.com/proxy/1*TGH72Nnw24QL3iV9IOm4VA.png"
  },
  {
    "name": "Medium",
    "payWall": true,
    "publisherUrl": "https://medium.com",
    "feedUrl": "https://medium.com/feed/tag/devops",
    "isActive": "Inactive",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "6 hours",
    "logo": "https://cdn-images-1.medium.com/proxy/1*TGH72Nnw24QL3iV9IOm4VA.png"
  },
  {
    "name": "Medium",
    "payWall": true,
    "publisherUrl": "https://medium.com",
    "feedUrl": "https://medium.com/feed/tag/culture",
    "isActive": "Inactive",
    "feedType": "xml",
    "primaryTag": "Culture",
    "frequency": "6 hours",
    "logo": "https://cdn-images-1.medium.com/proxy/1*TGH72Nnw24QL3iV9IOm4VA.png"
  },
  {
    "name": "Medium",
    "payWall": true,
    "publisherUrl": "https://medium.com",
    "feedUrl": "https://medium.com/feed/tag/society",
    "isActive": "Inactive",
    "feedType": "xml",
    "primaryTag": "Culture",
    "frequency": "6 hours",
    "logo": "https://cdn-images-1.medium.com/proxy/1*TGH72Nnw24QL3iV9IOm4VA.png"
  },
  {
    "name": "Medium",
    "payWall": true,
    "publisherUrl": "https://medium.com",
    "feedUrl": "https://medium.com/feed/tag/travel",
    "isActive": "Inactive",
    "feedType": "xml",
    "primaryTag": "Travel",
    "frequency": "6 hours",
    "logo": "https://cdn-images-1.medium.com/proxy/1*TGH72Nnw24QL3iV9IOm4VA.png"
  },
  {
    "name": "Medium",
    "payWall": true,
    "publisherUrl": "https://medium.com",
    "feedUrl": "https://medium.com/feed/tag/nature",
    "isActive": "Inactive",
    "feedType": "xml",
    "primaryTag": "Travel",
    "frequency": "6 hours",
    "logo": "https://cdn-images-1.medium.com/proxy/1*TGH72Nnw24QL3iV9IOm4VA.png"
  },
  {
    "name": "Medium",
    "payWall": true,
    "publisherUrl": "https://medium.com",
    "feedUrl": "https://medium.com/feed/tag/world",
    "isActive": "Inactive",
    "feedType": "xml",
    "primaryTag": "World",
    "frequency": "6 hours",
    "logo": "https://cdn-images-1.medium.com/proxy/1*TGH72Nnw24QL3iV9IOm4VA.png"
  },
  {
    "name": "Medium",
    "payWall": true,
    "publisherUrl": "https://medium.com",
    "feedUrl": "https://medium.com/feed/tag/entertainment",
    "isActive": "Inactive",
    "feedType": "xml",
    "primaryTag": "Entertainment",
    "frequency": "6 hours",
    "logo": "https://cdn-images-1.medium.com/proxy/1*TGH72Nnw24QL3iV9IOm4VA.png"
  },
  {
    "name": "Swiftjective-C",
    "payWall": false,
    "publisherUrl": "https://swiftjectivec.com/",
    "feedUrl": "https://swiftjectivec.com/feed.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "6 hours",
    "logo": ""
  },
  {
    "name": "Deku",
    "payWall": false,
    "publisherUrl": "https://deku.posstree.com/en/",
    "feedUrl": "https://deku.posstree.com/en/feed.xml",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "6 hours",
    "logo": ""
  },
  {
    "name": "CodingWithTashi",
    "payWall": false,
    "publisherUrl": "https://codingwithtashi.medium.com",
    "feedUrl": "https://codingwithtashi.medium.com/feed",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "6 hours",
    "logo": "https://cdn-images-1.medium.com/fit/c/150/150/1*E0snBlET16d0i5aSY9H8Gw.jpeg"
  },
  {
    "name": "ITNEXT",
    "payWall": false,
    "publisherUrl": "https://itnext.io",
    "feedUrl": "https://itnext.io/feed",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "6 hours",
    "logo": "https://cdn-images-1.medium.com/proxy/1*TGH72Nnw24QL3iV9IOm4VA.png"
  },
  {
    "name": "Ximya",
    "payWall": false,
    "publisherUrl": "https://medium.com/@ximya",
    "feedUrl": "https://medium.com/@ximya/feed",
    "isActive": "active",
    "feedType": "xml",
    "primaryTag": "Tech",
    "frequency": "6 hours",
    "logo": "https://cdn-images-1.medium.com/fit/c/150/150/1*Iq4-bb159lSKVrb_exoOPw.png"
  },
];

const interests = [
    {
      "name": "Tech",
    },
    {
      "name": "Crypto",
    },
    {
      "name": "Culture",
    },
    {
      "name": "Business",
    },
    {
      "name": "Sports",
    },
    {
      "name": "Politics",
    },
    {
      "name": "Entertainment",
    },
    {
      "name": "Health",
    },
    {
      "name": "Science",
    },
    {
      "name": "World",
    },
    // {
    //   "name": "Weather",
    // },
    {
      "name": "Food",
    },
    {
      "name": "Travel",
    },
    {
      "name": "LifeStyle",
    },
    // {
    //   "name": "News",
    // },
    {
      "name": "Misc",
    }
  ];
export async function handler(event: any) {

  const env  = event.params.env;

    if (env === "production") {
      for (const publisher of publishers) {
        const updateCommand = new UpdateItemCommand({
          TableName: Table.publisher.tableName,
          Key: {
            publisherName: { S: publisher.name },
            feedUrl: { S: publisher.feedUrl}
          },
          UpdateExpression: "SET isActive = :isActive, feedType = :feedType, logo = :logo, primaryTag = :primaryTag, payWall = :payWall, id = if_not_exists(id, :id)",
          ExpressionAttributeValues: {
              ":isActive": { S: publisher.isActive },
              ":feedType": { S: publisher.feedType },
              ":logo": { S: publisher.logo ?? '' },
              ":primaryTag": { S: publisher.primaryTag ?? '' },
              ":payWall": { BOOL: publisher.payWall ?? false },
              ":id": { S: v4() },
          },
        });
        await dbClient.send(updateCommand);
      }
    } else {
      for (const publisher of publishers) {
        // if(publisher.name === "MarketWatch" || publisher.name === "TechCrunch" || publisher.name === "Hacker News" || publisher.name === "Washington Post" || publisher.name === "The Economist" || publisher.name === "Medium" || publisher.name === "Deku") {
          if(publisher.name === "Deku" || publisher.name === "Swiftjective-C") {
          const updateCommand = new UpdateItemCommand({
            TableName: Table.publisher.tableName,
            Key: {
              publisherName: { S: publisher.name },
              feedUrl: { S: publisher.feedUrl}
            },
            UpdateExpression: "SET isActive = :isActive, feedType = :feedType, logo = :logo, primaryTag = :primaryTag, payWall = :payWall, id = if_not_exists(id, :id)",
            ExpressionAttributeValues: {
                ":isActive": { S: publisher.isActive },
                ":feedType": { S: publisher.feedType },
                ":logo": { S: publisher.logo ?? '' },
                ":primaryTag": { S: publisher.primaryTag ?? '' },
                ":payWall": { BOOL: publisher.payWall ?? false },
                ":id": { S: v4() },
            },
          });

          await dbClient.send(updateCommand);
        }
      }
    }

    for (const interest of interests) {
      const seedCommand = new PutItemCommand({
          TableName: Table.interests.tableName,
          Item: {
              id: { S: v4() },
              interestName: { S: interest.name },
          },
      })
      await dbClient.send(seedCommand);
    }

  return {
    statusCode: 201,
    body: JSON.stringify({ status: "successful" }),
  };
}
