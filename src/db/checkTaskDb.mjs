import { pool } from "./db.mjs"

export async function checkPeriodic() {
    const checkDbPeriodic = await pool.query(`
    SELECT *
    FROM periodic_tasks
    WHERE status = false AND created_time < EXTRACT(EPOCH FROM NOW()) * 1000 - 300000`,)
    return checkDbPeriodic.rows
}

export async function checkSha() {
    const checkDbSha = await pool.query(`
    SELECT *
    FROM sha_tasks
    WHERE status = false AND created_time < EXTRACT(EPOCH FROM NOW()) * 1000 - 300000`,)
    return checkDbSha.rows
}

export async function checkTriggered() {
    const checkDbTriggered = await pool.query(`
    SELECT *
    FROM triggered_tasks
    WHERE status = false AND created_time < EXTRACT(EPOCH FROM NOW()) * 1000 - 300000`,)
    return checkDbTriggered.rows
}

export async function deleteTaskPeriodic(jobId) {
    const delPeriodic = await pool.query(`
        DELETE FROM periodic_tasks
        WHERE job_id = $1`,
    [jobId])
}

export async function deleteTaskSha(jobId) {
    const delSha = await pool.query(`
        DELETE FROM sha_tasks
        WHERE job_id = $1`,
    [jobId])
}

export async function deleteTaskTriggered(jobId) {
    const delTriggered = await pool.query(`
        DELETE FROM triggered_tasks
        WHERE job_id = $1`,
    [jobId])
}
