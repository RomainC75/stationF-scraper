const puppeteer = require("puppeteer");
const { Cluster } = require("puppeteer-cluster");
const Jobs = require("../models/jobs.model");
const Startup = require("../models/startup.model");
const Temp = require("../models/temp.model");

const base_url = "https://jobs.stationf.co/startups";

module.exports = class Scrape {
  constructor() {
    (this.base_url = base_url), (this.browser = null), (this.page = null);
  }

  // init defines if there is a need to get a new links list on the main page
  async init(){
    const temp = await Temp.getAll()
    console.log('==> temp : ', temp.length)
    if(temp.length>0) {
      this.links=temp
    }else{
      await this.launchLinksScraper()
      await this.getStartupLinks()
      this.links.forEach(async (link)=>{
        const temp = new Temp(link)
        await temp.save()
      })
      this.links = await Temp.getAll()
    }
  }

  async launchLinksScraper() {
    console.log('=> get a new list of startups')
    this.browser = await puppeteer.launch({
      devtools: true,
      headless: false,
      slowMo: 300,
    });
    this.page = await this.browser.newPage();
    await this.page.goto(base_url);
    await this.page.waitForSelector(".organization-item");
  }

  async getStartupLinks() {
    this.links = await this.page.$$eval(".organization-link", (elements) =>
      elements.map((element) => element.getAttribute("href"))
    );
    await this.browser.close();
  }

  async clusterScrape() {
    console.log('=> getting startups details...')
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 4,
      monitor: true,
      timeout: 30000,
      puppeteerOptions: {
        headless: false,
        slowMo: 600,
        args: [`--window-size=${1680},${970}`],
      },
    });
    await cluster.task(async ({ page, data: linkObj }) => {
      const {url,id} = linkObj
      await page.goto("https://jobs.stationf.co" + url);
      await page.waitForSelector(
        ".cms-block-company_description > .text-formated"
      );
      await this.getInfosFromPage(page);
        await Temp.getByIdAndSetToIsDone(id)
    });
    this.links.forEach((link) => {
      if(link.isDone!==0){return}
      cluster.queue(link);
    });

    await cluster.idle();
    await cluster.close();
  }
  

  async getInfosFromPage(page) {
    const about = await page.$eval(
      ".cms-block-company_description > .text-formated",
      (el) => el.textContent
    );
    const title = await page.$eval("h1", (el) => el.textContent);
    const link = await page.url();
    const jobsList = await page.$$eval(
      ".jobs-list > .jobs-list-item h3",
      (elements) => elements.map((el) => el.textContent)
    );
    const cleanedJobsList = jobsList.map((txt) => txt.trim());

    this.saveInfosFromPageToDb(title, about, link, cleanedJobsList);
  }

  async saveInfosFromPageToDb(title, about, link, jobslist) {
    try {
      const startup = new Startup(title, link, about);
      const res = await startup.save();
      const startupId = res.id;

      jobslist.forEach(async (jobName) => {
        const job = new Jobs(jobName);
        await job.save(startupId);
      });
    } catch (error) {
      console.log("saveInfosFromPage ERROR : ", error);
    }
  }
};
