import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '../../.env' })


export const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT,
  ssl: false
})


export async function userVerification(userId) {
  const check = await pool.query(`
    SELECT EXISTS(
    SELECT 1
    FROM users
    WHERE id = $1)`,
    [userId])

  return check.rows[0].exists
}


