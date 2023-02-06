const db = require('./db/db')
const initDbTables = require('./db/init')


const Scrape = require('./scrape/scrape')
const Startup = require('./models/startup.model');




const launch = async() =>{
    try {
        await initDbTables()
        const scrape = new Scrape() 
        await scrape.init()
        await scrape.clusterScrape()

    } catch (error) {
        console.log('===>error : ',error)
    }
}

launch()