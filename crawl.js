/*
crawl.js

This scripts was used to generate a json file of all the trading cards. We're
 generating a JSON file so we're not constantly crawling the Met's website. Also,
 I doubt the card collection changes very much. However, if you want to update
 the data, run this script by running `node crawl.js` on the command line.

 */


//all the dependencies
var Xray = require('x-ray'); //used for crawling the Met's website
var RSVP = require('rsvp'); //promises to tame async functions
var fs = require('fs'); //used for writing the json file

var xray = Xray(); //intialize the library

var re = new RegExp("^(.+?),"); //regular expression we're using to grab the job title from the image title
var url = "http://www.metmuseum.org/collection/the-collection-online/search?ft=%22Occupations+for+Women%22";

var rawData;
var data;

//crawl the Met's website and grab relevant data
var fetch = function(){
  var promise = new RSVP.Promise(function(resolve,reject){

  xray(url, 'li', [{
        title: 'h3',
        image: '.image img@src',
        url: '.image-content a@href'
      }])
      .paginate('a.next@href')
      (function(err,obj){
        if (err) {
          reject(err);
        }else{
          resolve(obj);
        }
      })
      .limit(3);
  });
  return promise;
};

//process the fetched data and replace mobile thumbnails with larger images
var process = function(){
  var _data = [];
  var promise = new RSVP.Promise(function(resolve,reject){

    for(var i=0; i<rawData.length;i++){
      var title = rawData[i].title;
      var image = rawData[i].image;
      if (title.indexOf('Occupations for Women')!==-1) {
        var job = (title.match(re)[0]).slice(0, - 1);
        var newImage = image.replace('mobile-thumb','web-large');
        rawData[i].image = newImage;
        rawData[i].job = job;
        _data.push(rawData[i]);
      }
    }
    resolve(_data);
  });
  return promise;
};



fetch().then(
  function(data){
    rawData = data;

    process().then(function(data){
      //create json file
      var api = {data:data};
      var string = JSON.stringify(api);
      fs.writeFile('api.json', string, function (err) {
        if (err) return console.log(err);
        console.log('API created');
      });
    });
  }
);
