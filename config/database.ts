import pg from 'pg'


const pool = new pg.Pool({
  max: 20,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME
});


export const Db = {

  async one<T>(sql: string, params?: unknown[]) : Promise<T>{
    //run the query on a pooled connection
    const result = await pool.query(sql, params);
    //query returns one row
    return result.rows[0];
  },

  async many<T>(sql: string, params?: unknown[]) : Promise<T[]>{
    //run the query on a pooled connection
    const result = await pool.query(sql, params);
    //query returns many rows
    return result.rows;
  },
}