const db = require("../db/db");
const StartupJobsRel = require("./startupJobsRel.model");

module.exports = class Jobs {
  constructor(job) {
    (this.id = null), (this.job = job);
  }

  static async getById(id) {
    return await db.execute("SELECT * FROM jobs WHERE id=?", [id]);
  }

  async getObjectsByName() {
    const [recordedJobs] = await db.execute(
      "SELECT * FROM jobs WHERE `job` = ? ",
      [this.job]
    );
    return recordedJobs;
  }

  async save(startupId) {
    try {
      const foundJob = await this.getObjectsByName();
      if ( foundJob.length === 0 ) {
        await db.execute("INSERT INTO jobs (`job`) VALUES ( ? )", [this.job]);
      }
      const registeredJob = (await this.getObjectsByName())[0]
      const sjRelationnal = new StartupJobsRel(startupId, registeredJob.id)
      await sjRelationnal.save()
    } catch (error) {
      console.log("error", error);
    }
  }
};
