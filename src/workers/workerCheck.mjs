import { createClient } from 'redis'
import { checkPeriodic, checkSha, checkTriggered, deleteTaskPeriodic, deleteTaskTriggered, deleteTaskSha } from '../db/checkTaskDb.mjs';

const client = createClient()
if (!client.isOpen) {
    await client.connect().catch(console.error);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function periodic() {
    while (true) {
        try {
            await checkTaskPeriodic()
            await sleep(50000)
        } catch (e) {
            console.log(e)
        }
    }
}

async function sha() {
    while (true) {
        try {
            await checkTaskSha()
            await sleep(50000)
        } catch (e) {
            console.log(e)
        }
    }
}

async function triggered() {
    while (true) {
        try {
            await checkTaskTriggered()
            await sleep(50000)
        } catch (e) {
            console.log(e)
        }
    }
}


async function checkTaskPeriodic() {
    const isPeriodic = await checkPeriodic()

    if (isPeriodic.length == 0) {
        return null
    }

    for (let i = 0; i < isPeriodic.length; i++) {
        console.log(`Удалена задача ${isPeriodic[i].job_id} из periodic_tasks`)
        await deleteTaskPeriodic(isPeriodic[i].job_id)
    }
}

async function checkTaskSha() {
    const isSha = await checkSha()

    if (isSha.length == 0) {
        return null
    }

    for (let i = 0; i < isSha.length; i++) {
        console.log(`Удалена задача ${isSha[i].job_id} из sha_tasks`)
        await deleteTaskSha(isSha[i].job_id)
    }
}

async function checkTaskTriggered() {
    const isTriggered = await checkTriggered()

    if (isTriggered.length == 0) {
        return null
    }

    for (let i = 0; i < isTriggered.length; i++) {
        console.log(`Удалена задача ${isTriggered[i].job_id} из triggered_tasks`)
        await deleteTaskTriggered(isTriggered[i].job_id)
    }
}

periodic()
sha()
triggered()

