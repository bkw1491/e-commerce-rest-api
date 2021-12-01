import { RowDataPacket, OkPacket } from 'mysql2';

export type DbQueryResult<T> = T & (RowDataPacket[] | RowDataPacket[][] | OkPacket[] | OkPacket);