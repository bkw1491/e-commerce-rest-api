import mysql from 'mysql2';

export const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env["DB_HOST"],
  port: process.env["DB_PORT"],
  user: 'root',
  password: '', 
  database: 'e-commerce'
});
