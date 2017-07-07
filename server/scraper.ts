import * as https from 'https';
import Article from './article/articleModel';
import Source from './source/sourceModel';
import * as mongoose from 'mongoose';
const util = require('util');

module.exports = {
  startTimedScraping: startTimedScraping,
  requestAll: requestAll
};

mongoose.connect("mongodb://localhost:27017/team26");
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

    setInterval(function() {
        console.log("<<<<<<<requestAll>>>>>>>>");
        requestAll();
    }, 1000 * 30);
}

export function requestAll() {
    const aljazeeraGET = "/v1/articles?source=al-jazeera-english&sortBy=top&apiKey=" + apikey;
    const breitbartGET = "/v1/articles?source=breitbart-news&sortBy=top&apiKey=" + apikey;
    const cnnGET = "/v1/articles?source=cnn&sortBy=top&apiKey=" + apikey;
    const bbcGET = "/v1/articles?source=bbc-news&sortBy=top&apiKey=" + apikey;
    const timesIndiaGET = "/v1/articles?source=the-times-of-india&sortBy=top&apiKey=" + apikey;
    const hinduGET = "/v1/articles?source=the-hindu&sortBy=top&apiKey=" + apikey;
    const nytGET = "/v1/articles?source=the-new-york-times&sortBy=top&apiKey=" + apikey;
    const washingtonPostGET = "/v1/articles?source=the-washington-post&sortBy=top&apiKey=" + apikey;

    requestSource(aljazeeraGET, "Aljazeera");
    requestSource(breitbartGET, "Breitbart");
    requestSource(cnnGET, "CNN");
    requestSource(bbcGET, "BBC");
    requestSource(timesIndiaGET, "Times of India");
    requestSource(hinduGET, "The Hindu");
    requestSource(nytGET, "The New York Times");
    requestSource(washingtonPostGET, "Washington Post");
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
            const publishedAt = article["publishedAt"] ? article["publishedAt"] : Date.now;

            var instance = new Article({
                title: title,
                description: description,
                image: urlToImage,
                url: url,
                author: author,
                published: publishedAt,
                categories: [],
                source: source
            });

            // Article.count({"url": url}, function(err, count){
            //     if(err) return console.log("Error counting the number of existing articles");
            //     if(count > 0) return console.log("Already stored (" + sourceName + "): \"" + title + "\"");

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
            // });
        }
    });
}