// для periodic
import { pool } from "./db.mjs"

export async function rightNumber(taskTime, jobId) {
    const periodTableResT = await pool.query(`
    UPDATE periodic_tasks
    SET result = true,
    status = true,
    task_time = $1
    WHERE job_id = $2`,
    [taskTime, jobId])
    
}

export async function notRightNumber(taskTime, jobId) {
    const statusPeriodic = await pool.query(`
    UPDATE periodic_tasks
    SET status = true,
    task_time = $1
    WHERE job_id = $2`,
    [taskTime, jobId])
    
}

