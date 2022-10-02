const sqlite3 = require('sqlite3').verbose();

const mod_db = new sqlite3.Database("./small_packages/moderation.db");

mod_db.serialize(() => {
    // don't need this. Is originally for mute role
    // mod_db.run("CREATE TABLE IF NOT EXISTS mutes (member_id varchar(20), mute_start int, mute_length int);")
    mod_db.run("CREATE TABLE IF NOT EXISTS warns (id INTEGER PRIMARY KEY, member_id varchar(20), warns int);")
    mod_db.run("CREATE TABLE IF NOT EXISTS warn_reasons (id INTEGER PRIMARY KEY, warn_id int, member_id varchar(20), reason varchar(100));")
})

mod_db.close();
