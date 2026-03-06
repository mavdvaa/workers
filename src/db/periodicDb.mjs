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

export async function periodicResIntoUsers() {
    const periodTableRes = await pool.query(`
        UPDATE users
        SET 
        count_right_periodic_tasks = (
        SELECT COUNT(is_right)
        FROM periodic_tasks p
        WHERE p.user_id = users.id AND status = true AND is_right = true),
    
        count_periodic_tasks = (
        SELECT COUNT(status)
        FROM periodic_tasks p
        WHERE p.user_id = users.id AND status = true)`,
        )
    
}