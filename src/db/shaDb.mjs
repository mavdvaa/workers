import { pool } from "./db.mjs"

export async function shaResults(hash, taskTimeSHA, i, jobId) {
    const shaTableRes = await pool.query(`
    UPDATE sha_tasks
    SET result = $1,
    status = true,
    task_time = $2,
    i = $3
    WHERE job_id = $4`,
        [hash, taskTimeSHA, i, jobId])

}

