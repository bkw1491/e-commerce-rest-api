import { Db } from "./database";


const sqlUsers = `

  CREATE TABLE IF NOT EXISTS users (
    admin         BOOLEAN         NOT NULL,
    password      VARCHAR(255)    NOT NULL,
    email         VARCHAR(255)    UNIQUE NOT NULL,
    id            INTEGER         GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY
  )`;

const sqlCategory = `

   CREATE TABLE IF NOT EXISTS category (
    name          VARCHAR(255)    UNIQUE NOT NULL,
    descr         VARCHAR(255)    NOT NULL,
    id            INTEGER         GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY
  )`;

const sqlProduct = `

   CREATE TABLE IF NOT EXISTS product (
    image_url     VARCHAR(255)    NOT NULL,
    image_alt     VARCHAR(255)    NOT NULL,
    price         INTEGER         NOT NULL,
    descr         VARCHAR(255)    NOT NULL,
    name          VARCHAR(255)    NOT NULL,
    id            INTEGER         GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY
  )`;

const sqlProductCategory = `

  CREATE TABLE IF NOT EXISTS product_category (
    product_id    INTEGER         NOT NULL,
    category_name VARCHAR(255)    NOT NULL,
    id            INTEGER         GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,

    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    FOREIGN KEY (category_name) REFERENCES category(name) ON DELETE CASCADE
  )`;

const sqlInventory = `

  CREATE TABLE IF NOT EXISTS inventory (
    product_id    INTEGER         NOT NULL,
    quantity      INTEGER         NOT NULL,
    id            INTEGER         GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,

    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
  )`;

const sqlCart = `
  
   CREATE TABLE IF NOT EXISTS cart (
    quantity      INTEGER         NOT NULL,
    product_id    INTEGER         NOT NULL,
    user_id       INTEGER         NOT NULL,
    id            INTEGER         GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,

    FOREIGN KEY (product_id) REFERENCES product(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`;

const sqlOrder = `

   CREATE TABLE IF NOT EXISTS orders (
    status        VARCHAR(255)    NOT NULL,
    placed_date   TIMESTAMP       NOT NULL,
    total_cost    INTEGER         NOT NULL,
    user_id       INTEGER         NOT NULL,
    id            VARCHAR(255)    PRIMARY KEY,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`;

const sqlOrderItem = `

   CREATE TABLE IF NOT EXISTS order_item (
    quantity      INTEGER         NOT NULL,
    product_id    INTEGER         NOT NULL,
    order_id      VARCHAR(255)    NOT NULL,
    id            INTEGER         GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,

    FOREIGN KEY (product_id) REFERENCES product(id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  )`;

export async function setupTables() {

  try {
      //create tables with no foreign keys first
      const users = Db.one(sqlUsers);
      const category = Db.one(sqlCategory);
      const product = Db.one(sqlProduct);
      //create tables concurrently
      await Promise.all([users, category, product]);
    
      //tables have users, product or category foreign key
      const order = Db.one(sqlOrder);
      const inventory = Db.one(sqlInventory);
      const productCategory = Db.one(sqlProductCategory);
      const cart = Db.one(sqlCart);
      //create tables concurrently
      await Promise.all([order, inventory, productCategory, cart]);
    
      //tables have order foriegn key lasy
      await Db.one(sqlOrderItem);
  }

  catch(err: unknown) {
    console.log(err);
    throw new Error("error setting up one or more tables")
  }
}