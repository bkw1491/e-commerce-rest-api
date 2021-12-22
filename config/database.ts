import pg from 'pg';


const pool = new pg.Pool({
  max: 100,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME
});


export const Database = {

  /**
  * Run a single query using the connection pool. 
  */
  async one<T>(sql: string, params?: unknown[]) : Promise<T[]>{
    //run the query on a pooled connection
    const result = await pool.query(sql, params);
    //single query returns one result
    return result.rows;

  },

 /**
  * Runs multiple queries using the connection pool. 
  */
  async multi<T>(sql: string, params?: unknown[]) {
    //run multiple queries on a single connection
    const results = await pool.query(sql, params);
    console.log(results);
    //multi query returns an array of results
    return results.rows;
  }
}