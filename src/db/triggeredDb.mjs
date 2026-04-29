import { pool } from "./db.mjs"

export async function triggResults(results, sumNumbers, taskTimeRes, triggJobId) {
    const bdResTrigg = await pool.query(`
        UPDATE triggered_tasks
        SET status = true,
        count = $1,
        sum = $2,
        task_time = $3
        WHERE job_id = $4`,
        [results, sumNumbers, taskTimeRes, triggJobId])
}

