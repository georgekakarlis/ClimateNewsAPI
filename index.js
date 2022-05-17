const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')


const app = express()

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        //we need the base in case the URL is wrong
        base: 'https://www.telegraph.co.uk'
    },
    {
        name: 'dm',
        address: 'https://www.dailymail.co.uk/news/climate_change_global_warning/index.html',
        base: ''
    },
    {
        name: 'nyp',
        address: 'https://www.nypost.com/tag/climate-change/',
        //we need the base in case the URL is wrong
        base: ''
    },
]

const articles = []


newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("climate")', html).each(function () {
//whatever comes back is .this and we are getting the text from the A tag
      const title = $(this).text()
      const url = $(this).attr('href')

      articles.push({
          title,
          //fixing the base of URLS
          url: newspaper.base + url,
          source:newspaper.name
      })
        })
    })
})


app.get('/', (req, res) => {
    res.json('Welcome to my Climate Change News API')
})

app.get('/news', (req, res) => {

    //its commented out because it serves only as theguardian webscraper.

    //we take this link and we save the promise as an html == it returns the html in console.log
    /* axios.get('https://www.theguardian.com/environment/climate-crisis' )
    .then((response) => {
        const html = response.data
        //from here we use cheerio to pick elements
        const $ = cheerio.load(html)
       //here we take the title and of the A tags and the url (hrefs)
        $('a:contains("climate")', html).each(function () {
           const title = $(this).text()
           const url = $(this).attr('href')
           articles.push({
            title,
            url
           })

        })
        res.json(articles)
        //async JS to catch errors
    }).catch((err) => console.log(err)) */

res.json(articles)

})


app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId
    
    //filter array to find some specific newspaper
    //if we consolelog it we take back the whole object
 const newspaperAddress = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].address
   const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $('a:contains("climate")', html).each(function (){
           const title = $(this).text()
           const url = $(this).attr('href')
           specificArticles.push({
               title,
               url:newspaperBase + url,
               source: newspaperId
           })
        })
        res.json(specificArticles)
    }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))