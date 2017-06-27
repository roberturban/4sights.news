import * as https from 'https';
import Article from './article/articleModel';

module.exports = {
  startTimedScraping: startTimedScraping,
  test: test,
  requestAll: requestAll
};

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

    requestSource(aljazeeraGET);
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

    requestSource(aljazeeraGET);
    requestSource(breitbartGET);
    requestSource(cnnGET);
    requestSource(bbcGET);
    requestSource(timesIndiaGET);
    requestSource(hinduGET);
    requestSource(nytGET);
    requestSource(washingtonPostGET);
}

function requestSource(param) {
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
            saveData(obj);
        });
    });

    req.on('error', function(err) {
        console.log(err);
    });

    req.end();
}

function saveData(responseObj) {
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
            categories: []
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