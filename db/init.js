const db = require("./db");

module.exports = async () => {
  try {
    await db.execute(`CREATE TABLE IF NOT EXISTS temp (
            id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
            url VARCHAR(300),
            isDone BOOLEAN DEFAULT false,
            UNIQUE(url)
        )`);
    await db.execute(
      `CREATE TABLE IF NOT EXISTS main ( 
            id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, 
            title VARCHAR(300), 
            link VARCHAR(300), 
            about TEXT
        )`);
    await db.execute(`CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
            job VARCHAR(300),
            UNIQUE (job)
        );`);
    await db.execute(`CREATE TABLE IF NOT EXISTS startupjobsRel (
            mainID INTEGER NOT NULL,
            jobsID INTEGER NOT NULL,
            FOREIGN KEY (mainID) REFERENCES main(id), 
            FOREIGN KEY (jobsID) REFERENCES jobs(id),
            UNIQUE (mainID, jobsID)
        );`);
  } catch (error) {
    console.log("error : ", error);
  }
};
