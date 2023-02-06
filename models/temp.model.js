const db = require("../db/db");

module.exports = class Temp {
  constructor(link) {
    this.id = null
    this.link = link
  }

  async save() {
    try {
      await db.execute(
        "INSERT INTO `temp` (`url`) VALUES ( ? )",
        [this.link]
      );
    } catch (error) {
      console.log("temp - ERROR : ", error);
    }
  }

  static async getAll(){
    try {
        const res = await db.execute('SELECT * FROM temp')
        return res[0]
    } catch (error) {
        console.log('temp get All ERROR : ', error)
    }
  }

  static async getByIdAndSetToIsDone(id){
    try {
        const [links] = await db.execute(`
            UPDATE temp SET isDone = ? WHERE id= ?
        `,[true,id]) 
    } catch (error) {
        console.log('temps set to isDone : ', error)
    }
  }
};
