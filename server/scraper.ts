import * as https from 'https';
import Article from './article/articleModel';
import Source from './source/sourceModel';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as express from 'express';
const util = require('util');

module.exports = {
  startTimedScraping: startTimedScraping,
  requestAll: requestAll
};

const app = express();
dotenv.load({ path: '.env' });
app.set('port', (process.env.PORT || 3000));
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
(<any>mongoose).Promise = global.Promise;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  console.log("Start scraper")
  startTimedScraping();
});

const apikey = "11358ca80a144ea79d32c7879dd4332c"

export function startTimedScraping() {
    console.log("Scraper Interval set")

    requestAll();
    setInterval(function() {
        console.log("<<<<<<<requestAll>>>>>>>>");
        requestAll();
    }, 1000 * 60 * 60); //1 hour
}

export function requestAll() {
    const aljazeeraGET = "/v1/articles?source=al-jazeera-english&sortBy=top&apiKey=" + apikey;
    requestSource(aljazeeraGET, "Aljazeera");

    const breitbartGET = "/v1/articles?source=breitbart-news&sortBy=top&apiKey=" + apikey;
    requestSource(breitbartGET, "Breitbart");

    const cnnGET = "/v1/articles?source=cnn&sortBy=top&apiKey=" + apikey;
    requestSource(cnnGET, "CNN");

    const bbcGET = "/v1/articles?source=bbc-news&sortBy=top&apiKey=" + apikey;
    requestSource(bbcGET, "BBC");

    const timesIndiaGET = "/v1/articles?source=the-times-of-india&sortBy=top&apiKey=" + apikey;
    requestSource(timesIndiaGET, "Times of India");

    const hinduGET = "/v1/articles?source=the-hindu&sortBy=top&apiKey=" + apikey;
    requestSource(hinduGET, "The Hindu");

    const nytGET = "/v1/articles?source=the-new-york-times&sortBy=top&apiKey=" + apikey;
    requestSource(nytGET, "The New York Times");

    const washingtonPostGET = "/v1/articles?source=the-washington-post&sortBy=top&apiKey=" + apikey;
    requestSource(washingtonPostGET, "Washington Post");

    const abcGET = "https://newsapi.org/v1/articles?source=abc-news-au&sortBy=top&apiKey=" + apikey;
    requestSource(abcGET, "ABC News");

    const arsTechnicaGET = "https://newsapi.org/v1/articles?source=ars-technica&sortBy=top&apiKey=" + apikey;
    requestSource(arsTechnicaGET, "ARS Technica");

    const bbcSportsGET = "https://newsapi.org/v1/articles?source=bbc-sport&sortBy=top&apiKey=" + apikey;
    requestSource(bbcSportsGET, "BBC Sport");

    const bloombergGET = "https://newsapi.org/v1/articles?source=bloomberg&sortBy=top&apiKey=" + apikey;
    requestSource(bloombergGET, "Bloomberg");

    const businessInsiderGET = "https://newsapi.org/v1/articles?source=business-insider&sortBy=top&apiKey=" + apikey;
    requestSource(businessInsiderGET, "Bussiness Insider");

    const engadgetGET = "https://newsapi.org/v1/articles?source=engadget&sortBy=top&apiKey=" + apikey;
    requestSource(engadgetGET, "Engadget");

    const financialTimesGET = "https://newsapi.org/v1/articles?source=financial-times&sortBy=top&apiKey=" + apikey;
    requestSource(financialTimesGET, "Financial Times");

    const techCrunchGET = "https://newsapi.org/v1/articles?source=techcrunch&sortBy=top&apiKey=" + apikey;
    requestSource(techCrunchGET, "TechCrunch");

    const economistGET = "https://newsapi.org/v1/articles?source=the-economist&sortBy=top&apiKey=" + apikey;
    requestSource(economistGET, "Economist");

    const theVergeGET = "https://newsapi.org/v1/articles?source=the-verge&sortBy=top&apiKey=" + apikey;
    requestSource(theVergeGET, "The Verge");
}

function requestSource(param, sourceName) {
    var options = {
        host: "newsapi.org",
        port: 443,
        path: param,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const req = https.request(options, function(res) {
        var output = '';
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            //console.log(output)
            var obj = JSON.parse(output);
            saveData(obj, sourceName);
        });
    });

    req.on('error', function(err) {
        console.log(err);
    });

    req.end();
}

function saveData(responseObj, sourceName) {
    Source.findOne({"name": sourceName}, function(err, source) {
        if(err) return console.log("Coule not store article, source " + sourceName + " not found");

        var articles = responseObj["articles"];
        for(let index in articles) {
            const article = articles[index];
            const title = article["title"];
            const author = article["author"];
            const description = article["description"];
            const url = article["url"];
            const urlToImage = article["urlToImage"];
            const publishedAt = article["publishedAt"] ? article["publishedAt"] : Date.now();

            const instance = new Article({
                title: title,
                description: description,
                image: urlToImage,
                url: url,
                author: author,
                published: publishedAt,
                categories: [],
                source: source
            });

            instance.save((err, item) => {
                // 11000 is the code for duplicate key error
                if (err && err.code === 11000) {
                    console.error("Item duplicated");
                }
                if (err) {
                    console.error(err);
                }
                console.log("Item saved (" + sourceName + "): \"" + title + "\"");
            });
        }
    });
}