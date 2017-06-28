import * as https from 'https';
import Article from './article/articleModel';
import Source from './source/sourceModel';

module.exports = {
    startTimedScraping: startTimedScraping,
    test: test,
    requestAll: requestAll
};

console.log("Start scraper")
startTimedScraping();

const apikey = "11358ca80a144ea79d32c7879dd4332c"

export function startTimedScraping() {
    console.log("Scraper Interval set")
    setInterval(function() {
        console.log("Test");
        test();
    }, 1000 * 30);
}

export function test() {
    console.log("Test function called");

    const aljazeeraGET = "/v1/articles?source=al-jazeera-english&sortBy=top&apiKey=" + apikey;
    const aljazeeraObj = Source.findOne({name: "Aljazeera"});

    requestSource(aljazeeraGET, aljazeeraObj);
}

export function requestAll() {
    const aljazeeraGET = "/v1/articles?source=al-jazeera-english&sortBy=top&apiKey=" + apikey;
    const aljazeeraObj = Source.findOne({name: "Aljazeera"});
    const breitbartGET = "/v1/articles?source=breitbart-news&sortBy=top&apiKey=" + apikey;
    const breitbartObj = Source.findOne({name: "Breitbart"});
    const cnnGET = "/v1/articles?source=cnn&sortBy=top&apiKey=" + apikey;
    const cnnObj = Source.findOne({name: "CNN"});
    const bbcGET = "/v1/articles?source=bbc-news&sortBy=top&apiKey=" + apikey;
    const bbcObj = Source.findOne({name: "BBC"});
    const timesIndiaGET = "/v1/articles?source=the-times-of-india&sortBy=top&apiKey=" + apikey;
    const timesIndiaObj = Source.findOne({name: "The Times of India"});
    const hinduGET = "/v1/articles?source=the-hindu&sortBy=top&apiKey=" + apikey;
    const hinduObj = Source.findOne({name: "The Hindu"});
    const nytGET = "/v1/articles?source=the-new-york-times&sortBy=top&apiKey=" + apikey;
    const nytObj = Source.findOne({name: "The New York Times"});
    const washingtonPostGET = "/v1/articles?source=the-washington-post&sortBy=top&apiKey=" + apikey;
    const washingtonPostObj = Source.findOne({name: "The Washington Post"});

    requestSource(aljazeeraGET, aljazeeraObj);
    requestSource(breitbartGET, breitbartObj);
    requestSource(cnnGET, cnnObj);
    requestSource(bbcGET, bbcObj);
    requestSource(timesIndiaGET, timesIndiaObj);
    requestSource(hinduGET, hinduObj);
    requestSource(nytGET, nytObj);
    requestSource(washingtonPostGET, washingtonPostObj);
}

function requestSource(param, sourceObj) {
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
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            console.log(output)
            var obj = JSON.parse(output);
            console.log("Done: " + obj);
            saveData(obj, sourceObj);
        });
    });

    req.on('error', function(err) {
        console.log(err);
    });

    req.end();
}

function saveData(responseObj, sourceObj) {
    var articles = responseObj["articles"];
    console.log(articles);
    for(let index in articles) {
        const article = articles[index];

        const title = article["title"];
        const author = article["author"];
        const description = article["description"];
        const url = article["url"];
        const urlToImage = article["urlToImage"];
        const publishedAt = article["publishedAt"];

        var instance = new Article({
            title: title,
            description: description,
            image: urlToImage,
            url: url,
            author: author,
            published: publishedAt,
            categories: [],
            //source: sourceObj
        });

        instance.save((err, item) => {
            // 11000 is the code for duplicate key error
            if (err && err.code === 11000) {
                console.error("Item duplicated");
            }
            if (err) {
                console.error(err);
            }
            console.log("Item saved: " + item);
        });
    }
}