const db = require("../db/db");

module.exports = class Startup {
  constructor(title, link, about) {
    (this.id = null),
      (this.title = title),
      (this.link = link),
      (this.about = about)
  }
  static async getById(id) {
    return await db.execute("SELECT * FROM main WHERE id=?", [id]);
  }

  async save() {
    try {
        await db.execute(
          "INSERT INTO main (`title`, `about`, `link`) VALUES ( ? , ? , ? )",
          [this.title, this.about, this.link]
        );
        const [recordedStartups] = await db.execute("SELECT * FROM main WHERE `title` = ? ",[this.title])
        return recordedStartups[0]
    } catch (error) {
        console.log('save error : ', error)
    }
  }

  
};
