# Jobs for Women
## Source code for this [page](http://projects.amycheng.info/jobsforwomen)

This repo has all the code I wrote for [Jobs For Women](http://projects.amycheng.info/jobsforwomen) and includes:

- a Node script to scrape and download images off the [Metropolitan Museum of Art](http://www.metmuseum.org/) website (DON'T CONTINUALLY SCRAPE THE SITE, IT'S NOT POLITE)
- a single page app written in [React](https://facebook.github.io/react/) and shows a random card on reload or when the visitor clicks the button. Also has permalinks!
- a JSON file that acts like an API

Directions for running this project locally:

1. run `npm install`
2. run `node crawl.js` to download the images
3. run `grunt` to run a server on your local machine
