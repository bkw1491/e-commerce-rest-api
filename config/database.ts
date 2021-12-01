import mysql from 'mysql2/promise';

import { DbQueryResult } from '@interfaces/IQueryResult';


const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env["DB_HOST"],
  port: Number(process.env["DB_PORT"]),
  user: process.env["DB_USER"],
  password: process.env["DB_PASSWORD"], 
  database: process.env["DB_NAME"]
});


/**
 * Run a query using a pooled connection 
 */
 export default async function <T>(sql: string, options?: unknown[]): Promise<DbQueryResult<T[]>> {

  const [result] = await pool.execute<DbQueryResult<T[]>>(sql, options);

  return result;
}