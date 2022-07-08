import { combineReducers } from "redux";
import user from "./user";
import family from "./family";
import sidebar from "./sidebarReducer";
import person from "./person";
import ww1 from "./ww1";
import search from "./search";
import personResearch from "./personResearch";
import story from "./story";
import USFederalCensus from "./USFederalCensus";
import USCensus from "./USCensus";
import homepage from "./homepage";
import germanToAmerica from "./germanToAmerica";
import italiansToAmerica from "./ItaliansToAmerica";
import ww2 from "./ww2";
import russian from "./russian";
import irish from "./irish";
import toastr from "./toastr";
import USSocialSecurity from "./USSocialSecurity";
import massachussets from "./massachussets";
import media from "./media";
import nyc from "./NYC";
import texasMarriages from "./texasMarriage";
import notification from "./notification";
import usFederal1800 from "./usFederal1800";
import usCensus1810 from "./usCensus1810";
import usCensus1820 from "./usCensus1820";
import usCensus1830 from "./usCensus1830";
import usCensus1840 from "./usCensus1840";
import UsCensus1901 from "./UsCensus1901";
import usCensus1881 from "./UsCensus1881";
import usCensus1871 from "./UsCensus1871";
import UkCensus1891 from "./Ukcensus1891";
import ukCensus1861 from "./ukCensus1861";
import ukCensus1851 from "./ukCensus1851";
import UkCensus1841 from "./Ukcensus1841";
import washingtonMarriages from "./washingtonMarriages";
import payment from "./payment";
import paymenttax from "./paymenttax";

import massachusettsMarriages from "./massachusettsMarriages";
import personRecord from "./personRecord";
import location from "./location";
import publication from "./publication";
import ohioDeaths from "./ohioDeaths";
import follow from "./follow";
import topic from "./topic";
import relationship from "./relationship";
import layout from "./layout";
import civilWar from "./CivilWar";
import NYDeaths from "./NYDeaths";
import browseLocation from "./browseLocation"
import comments from "./comments"
import Reportstory from "./reportstory"
export default combineReducers({ paymenttax, layout, relationship, homepage, user, USCensus, family, sidebar, person, ww1, search, personResearch, story, USFederalCensus, germanToAmerica, ww2, russian, irish, USSocialSecurity, massachussets, nyc, italiansToAmerica, media, toastr, texasMarriages, washingtonMarriages, usFederal1800, usCensus1810, usCensus1820, usCensus1830, usCensus1840, UsCensus1901, usCensus1881, usCensus1871, UkCensus1891, ukCensus1851, UkCensus1841, ukCensus1861, payment, massachusettsMarriages, personRecord, location, publication, notification, ohioDeaths, follow, topic, civilWar , NYDeaths, browseLocation,comments,Reportstory });
