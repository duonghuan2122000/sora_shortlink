import { IUser } from "@src/models/UserModel";
import { getRandomInt } from "@src/common/util/misc";

import orm from "./MockOrm";
import { IUserEntity, IUserEntityRaw } from "./entities/UserEntity";
import DbConnection from "./DbConnection";

import mysql from "mysql2/promise";
import BaseRepo from "./BaseRepo";
import DateHelper from "@src/common/util/DateHelper";
import { I } from "vitest/dist/chunks/reporters.d.BFLkQcL6";

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get one user.
 */
async function getOne(email: string): Promise<IUser | null> {
  const db = await orm.openDb();
  for (const user of db.users) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

/**
 * See if a user with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
  const db = await orm.openDb();
  for (const user of db.users) {
    if (user.id === id) {
      return true;
    }
  }
  return false;
}

/**
 * Get all users.
 */
async function getAll(): Promise<IUser[]> {
  const db = await orm.openDb();
  return db.users;
}

/**
 * Add one user.
 */
async function add(user: IUser): Promise<void> {
  const db = await orm.openDb();
  user.id = getRandomInt();
  db.users.push(user);
  return orm.saveDb(db);
}

/**
 * Update a user.
 */
async function update(user: IUser): Promise<void> {
  const db = await orm.openDb();
  for (let i = 0; i < db.users.length; i++) {
    if (db.users[i].id === user.id) {
      const dbUser = db.users[i];
      db.users[i] = {
        ...dbUser,
        name: user.name,
        email: user.email,
      };
      return orm.saveDb(db);
    }
  }
}

/**
 * Delete one user.
 */
async function delete_(id: number): Promise<void> {
  const db = await orm.openDb();
  for (let i = 0; i < db.users.length; i++) {
    if (db.users[i].id === id) {
      db.users.splice(i, 1);
      return orm.saveDb(db);
    }
  }
}

// **** Unit-Tests Only **** //

/**
 * Delete every user record.
 */
async function deleteAllUsers(): Promise<void> {
  const db = await orm.openDb();
  db.users = [];
  return orm.saveDb(db);
}

/**
 * Insert multiple users. Can't do multiple at once cause using a plain file
 * for nmow.
 */
async function insertMult(users: IUser[] | readonly IUser[]): Promise<IUser[]> {
  const db = await orm.openDb(),
    usersF = [...users];
  for (const user of usersF) {
    user.id = getRandomInt();
    user.created = new Date();
  }
  db.users = [...db.users, ...users];
  await orm.saveDb(db);
  return usersF;
}

/**
 * Hàm lấy thông tin user bằng email
 */
async function getOneByEmail(
  email: string,
  connection: mysql.PoolConnection
): Promise<IUserEntity | null> {
  const query = "SELECT * FROM soraUser u WHERE u.email = ? LIMIT 1";
  const [rows] = await connection.query<IUserEntity[]>(query, [email]);
  if (rows?.length == 1) {
    return rows[0];
  }
  return null;
}

/**
 * Hàm lấy thông tin user bằng id
 * @param id Id user
 * @param connection Connection to db
 */
async function getById(
  id: string,
  connection: mysql.PoolConnection
): Promise<IUserEntity | null> {
  const query = "SELECT * FROM soraUser u WHERE u.id = ? LIMIT 1";
  const [rows] = await connection.query<IUserEntity[]>(query, [id]);
  if (rows?.length == 1) {
    return rows[0];
  }
  return null;
}

/**
 * Hàm thêm user
 */
async function insert(
  user: Partial<IUserEntityRaw>,
  connection: mysql.PoolConnection
): Promise<IUserEntity | null> {
  user.id = BaseRepo.genUUID();
  const query = `INSERT INTO soraUser (id, email, createdDate, updatedDate) values (?, ?, ?, ?);`;
  const [rows] = await connection.query<IUserEntity[]>(query, [
    user.id,
    user.email,
    DateHelper.toSqlDateTime(new Date()),
    null,
    user.id,
  ]);

  return await getById(user.id, connection);
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getOne,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
  deleteAllUsers,
  insertMult,
  getOneByEmail,
  getById,
  insert,
} as const;
