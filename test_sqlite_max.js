const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE t (id INT, txt TEXT, date TEXT)");
    db.run("INSERT INTO t VALUES (1, 'first', '2020-01-01')");
    db.run("INSERT INTO t VALUES (1, 'second', '2020-01-02')");
    db.run("INSERT INTO t VALUES (2, 'a', '2020-01-01')");
    db.run("INSERT INTO t VALUES (2, 'b', '2020-01-03')");
    db.all("SELECT id, txt, MAX(date) as md FROM t GROUP BY id", (err, rows) => {
        console.log(rows);
    });
});
