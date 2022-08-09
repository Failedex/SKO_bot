const sqlite3 = require('sqlite3').verbose();

const mod_db = new sqlite3.Database("./small_packages/moderation.db");

mod_db.serialize(() => {
    mod_db.run("CREATE TABLE IF NOT EXISTS mutes (member_id varchar(20), mute_start int, mute_length int);")
    // mod_db.run("CREATE TABLE IF NOT EXISTS warns (member_id varchar(20), member_tag varchar(50), warns int);")
})
