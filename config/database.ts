import pg from 'pg'
import { setupTables } from './tables';

//TODO better way to manage different enviroments?
function getOptions() {

  //options for production
  if(process.env.NODE_ENV == "production") {

    return {

      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  }

  //dev
  return {
    max: 20,
    host: process.env.DATABASE_URL,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD, 
    database: process.env.DATABASE_NAME
  }
}

//intialize a new ctn pool using above options
const pool = new pg.Pool(getOptions());


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

  async none(sql: string, params?: unknown[]) : Promise<void> {
    //returns no rows, currently only used when creating indexes
    await pool.query(sql, params);
  }
}

setupTables();