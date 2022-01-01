import { Db } from "./database";


const sqlUsers = `

  CREATE TABLE IF NOT EXISTS users (
    admin         BOOLEAN         NOT NULL,
    password      VARCHAR(255)    NOT NULL,
    email         VARCHAR(255)    NOT NULL,
    id            INTEGER         GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY
  )`;

const sqlCategory = `

   CREATE TABLE IF NOT EXISTS category (
    name          VARCHAR(255)    NOT NULL,
    id            INTEGER         GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY
  )`;

const sqlProduct = `

   CREATE TABLE IF NOT EXISTS product (
    inventory     INTEGER         NOT NULL,
    image_url     VARCHAR(255)    NULL,
    price         REAL            NOT NULL,
    descr         VARCHAR(255)    NOT NULL,
    name          VARCHAR(255)    NOT NULL,
    category_id   INTEGER         NOT NULL,
    id            INTEGER         GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY

    FOREIGN KEY (category_id) REFERENCES category(id)
  )`;

const sqlCart = `
  
   CREATE TABLE IF NOT EXISTS cart (
    quantity      INTEGER         NOT NULL,
    product_id    INTEGER         NOT NULL,
    user_id       INTEGER         NOT NULL,
    id            INTEGER         GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY

    FOREIGN KEY (product_id) REFERENCES product(id)
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`;

const sqlOrder = `

   CREATE TABLE IF NOT EXISTS "order" (
    status        VARCHAR(255)    NOT NULL,
    placed_date   DATE            NOT NULL,
    total_cost    REAL            NOT NULL,
    user_id       INTEGER         NOT NULL,
    id            INTEGER         GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY
    
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`;

const sqlOrderItem = `

   CREATE TABLE IF NOT EXISTS order_item (
    quantity      INTEGER         NOT NULL,
    product_id    INTEGER         NOT NULL,
    order_id      INTEGER         NOT NULL,
    id            INTEGER         GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY

    FOREIGN KEY (product_id) REFERENCES product(id)
    FOREIGN KEY (order_id) REFERENCES order(id)
  )`;

export async function setupTables() {

  //create tables with no primary keys first
  const users = Db.one(sqlUsers);
  const category = Db.one(sqlCategory);
  //create tables concurrently
  await Promise.all([users, category]);

  //tables that have users or category foreign key
  const product = Db.one(sqlProduct);
  const order = Db.one(sqlOrder);
  //create tables concurrently
  await Promise.all([product, order]);

  //tables have product or order foriegn key lasy
  const cart = Db.one(sqlCart);
  const orderItem = Db.one(sqlOrderItem);

  //create tables concurrently
  await Promise.all([cart, orderItem]);
}