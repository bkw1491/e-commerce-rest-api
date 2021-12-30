import pg from 'pg'


const pool = new pg.Pool({
  max: 20,
  host: process.env.DATABASE_URL,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD, 
  database: process.env.DATABASE_NAME
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