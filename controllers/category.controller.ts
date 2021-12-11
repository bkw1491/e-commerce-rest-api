import query from '@config/database';
import { ICategory } from "@models/category.model";


/**
 * Finds a row in the category table, returns null if not found
 */
export async function findOne(id: number) : Promise<ICategory> {

  const sql = `SELECT *
               FROM category
               WHERE id = $1`;

  const result = await query<ICategory>(sql, [id]);

  return result[0];
}


/**
 * Creates a new row in the category table. Returns the new row
 */
export async function createOne(name: string) : Promise<ICategory> {

  //db auto assigns category_id
  const sql = `INSERT INTO category (name)
               VALUES $1
               RETURNING *`;

  const result = await query<ICategory>(sql, [name]);
  //return the new row
  return result[0];
}


/**
 * Updates ta row in the category table. Returns the updated row
 */
export async function updateOne(category: ICategory) : Promise<ICategory> {

  const sql = `UPDATE category
               SET name = $1
               WHERE id = $2
               RETURNING *`;

  const result = await query<ICategory>(sql, [category.name, category.id]);
  //return the updated row
  return result[0];
}


/**
 * Deletes a category record
 * with provided id. Cascades to all products assigned to this category
 */
export async function deleteOne(id: number) : Promise<ICategory> {

  const sql = `DELETE FROM category
               WHERE id = $1
               RETURNING *`;

  const result = await query<ICategory>(sql, [id]);
  //return the deleted row
  return result[0];
}