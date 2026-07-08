const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function check() {
  const result = await pool.query('SELECT COUNT(*) FROM "Product"');
  console.log(result.rows);

  await pool.end();
}

check();