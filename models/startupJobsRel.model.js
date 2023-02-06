const db = require("../db/db");

module.exports = class StartupJobsRel {
  constructor(startupID, jobID) {
    (this.startupID = startupID), (this.jobID = jobID);
  }
  async save() {
    try {
      await db.execute(
        "INSERT INTO `startupjobsRel` (`mainID`, `jobsID`) VALUES ( ? , ? )",
        [this.startupID, this.jobID]
      );
    } catch (error) {
      console.log("startupJobsRel - ERROR : ", error);
    }
  }
};
