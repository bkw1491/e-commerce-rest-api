import pg from 'node-postgres';


const pool = new pg.Pool({
  max: 100,
  host: process.env["DB_HOST"],
  port: Number(process.env["DB_PORT"]),
  user: process.env["DB_USER"],
  password: process.env["DB_PASSWORD"], 
  database: process.env["DB_NAME"]
});


/**
 * Run a query using a pooled connection 
 */
 export default async function<T>(sql: string, params?: unknown[]) : Promise<T[]>{

  const result = await pool.query(sql, params);

  return result.rows;
}