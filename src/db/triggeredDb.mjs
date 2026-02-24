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

export async function triggeredResIntoUsers() {
    const triggTableRes = await pool.query(`
        UPDATE users
        SET 
        count_right_triggered_tasks = (
        SELECT COUNT(is_right)
        FROM triggered_tasks t
        WHERE t.user_id = users.id AND status = true AND is_right = true),
      
        count_triggered_tasks = (
        SELECT COUNT(status)
        FROM triggered_tasks t
        WHERE t.user_id = users.id AND status = true)`,
    )
}