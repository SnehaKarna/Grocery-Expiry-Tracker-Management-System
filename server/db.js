const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',         // change this as per your DB
  password: 'sneha@2004',
  host: 'localhost',
  port: 5432,
  database: 'expiry_tracker_db'
});

module.exports = pool;
