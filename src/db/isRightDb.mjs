import { pool } from "./db.mjs"

export async function isRightReriodic(jobId) {
    const check_right = await pool.query(`
    SELECT *
    FROM periodic_right_answers r
    JOIN periodic_tasks p
    ON p.number = ANY(r.periodic_right)
    WHERE job_id = $1 AND status = true`,
    [jobId])

    if (check_right.rows.length > 0) {
        const res_true1 = await pool.query(`
            UPDATE periodic_tasks
            SET is_right = true
            WHERE job_id = $1 AND result = true`,
        [jobId])
    } else {
        const res_true2 = await pool.query(`
        UPDATE periodic_tasks
        SET is_right = true
        WHERE job_id = $1 AND result = false`,
        [jobId])

    }
    
}

export async function isRightTriggered(jobId) {
    const check_right_trigg = await pool.query(`
    SELECT * FROM triggered_tasks t
    JOIN triggered_right_answers r
    ON r.right_count = t.count AND r.difficulty = t.difficulty AND r.right_sum = t.sum 
    WHERE job_id = $1`,
    [jobId])

    if (check_right_trigg.rows.length > 0) {
        const res_trigg_true = await pool.query(`
        UPDATE triggered_tasks
        SET is_right = true
        WHERE job_id = $1`,
        [jobId])
    }
  
}

export async function checkResSha(jobId, prefixL, prefix) {
    const checkResSha = await pool.query(`
    UPDATE sha_tasks
    SET is_right = true
    WHERE job_id = $1 AND 
    LEFT(result, $2) = $3`,
    [jobId, prefixL, prefix])
}