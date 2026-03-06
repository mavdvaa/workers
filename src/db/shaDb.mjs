import { pool } from "./db.mjs"

export async function shaResults(prefix, hash, taskTimeSHA, jobId) {
    const shaTableRes = await pool.query(`
    UPDATE sha_tasks
    SET prefix = $1,
    result = $2,
    status = true,
    task_time = $3
    WHERE job_id = $4`,
        [prefix, hash, taskTimeSHA, jobId])

}

export async function shaResIntoUsers() {
    const shaTableUsers = await pool.query(`
    UPDATE users
    SET 
    count_right_sha_tasks = (
    SELECT COUNT(is_right)
    FROM sha_tasks s
    WHERE s.user_id = users.id AND status = true AND is_right = true),
          
    count_sha_tasks = (
    SELECT COUNT(status)
    FROM sha_tasks s
    WHERE s.user_id = users.id AND status = true)`,
    )

}