import initSqlJs from 'sql.js';

let db = null;
export async function initDB() {
  const SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}` });
  db = new SQL.Database();
  // Création tables
  db.run(`
    CREATE TABLE IF NOT EXISTS Person (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS Relation (
      parent_id INTEGER,
      child_id INTEGER,
      FOREIGN KEY(parent_id) REFERENCES Person(id),
      FOREIGN KEY(child_id)  REFERENCES Person(id)
    );
  `);
}

export function addPerson(name) {
  const stmt = db.prepare('INSERT INTO Person (name) VALUES (?)');
  stmt.run([name]);
  stmt.free();
}

export function getPersons() {
  const res = db.exec('SELECT id, name FROM Person');
  if (res.length === 0) return [];
  return res[0].values.map(([id, name]) => ({ id, name }));
}

export function addRelation(parentId, childId) {
  const stmt = db.prepare('INSERT INTO Relation (parent_id, child_id) VALUES (?,?)');
  stmt.run([parentId, childId]);
  stmt.free();
}

export function getRelations() {
  const res = db.exec('SELECT parent_id, child_id FROM Relation');
  if (res.length === 0) return [];
  return res[0].values.map(([p, c]) => ({ parent_id: p, child_id: c }));
}