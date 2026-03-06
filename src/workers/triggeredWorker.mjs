import { createClient } from 'redis'
import { verify } from '../crypto/cryptoPackage.mjs'
import { countT } from '../scaling/scaling.mjs'
import { userVerification } from '../db/db.mjs'
import { triggResults, triggeredResIntoUsers } from '../db/triggeredDb.mjs'
import { isRightTriggered } from '../db/isRightDB.mjs'


const client = createClient()
if (!client.isOpen) {
    await client.connect().catch(console.error);
}

async function startTriggered() {
    while (true) {
        try {
            await processTriggeredTask()
        } catch (e) {
            console.log(e)
        }
    }
}

startTriggered()

// triggered
export async function processTriggeredTask() {

    const workerId = `Agent-${Math.random().toString(36).substring(7)}`

    const task = await client.brPopLPush('triggered-task', 'triggered-processing', 1)

    if (!task) {
        return null
    }

    const data = JSON.parse(task)

    const { signature, publicKey, userId, difficulty, timeStartTrigg, jobId, start, end } = data

    const dataToVerify = { userId, difficulty, timeStartTrigg }

    const checkUserTrigg = await userVerification(userId)
    const checkDifficiltyTrigg = (difficulty > 0 && difficulty < 4) ? true : false

    if (!checkDifficiltyTrigg) {
        return {
            body: JSON.stringify({ message: `Уровень сложности не должен быть меньше 1 или больше 3` })
        }
    }

    if (!checkUserTrigg) {
        return {
            body: JSON.stringify({ message: `Пользователя с id ${userId} не существует` })
        }
    }

    const isVerified = verify(dataToVerify, signature, publicKey)

    if (!isVerified) {
        console.log("Подпись для задачи triggered не прошла проверку")
        return null
    }

    let count = 0
    let sum = 0

    function isSimple(i) {
        if (i < 2) return false;
        if (i == 2 || i == 3) return true;
        if (i % 2 == 0 || i % 3 == 0) return false;
        for (let j = 5; j ** 2 <= i; j += 6) {
            if (i % j == 0 || i % (j + 2) == 0) return false;
        }
        return true;
    }

    for (let i = start; i < end; i++) {
        if (isSimple(i)) {
            count += 1
            sum += i;
        }
    }
    const taskTime = (Date.now() - timeStartTrigg) / 1000

    await client.hIncrBy(`triggered:${jobId}`, 'count', count)
    await client.hIncrBy(`triggered:${jobId}`, 'sum', sum)

    console.log(`Результат от worker ${workerId} для задачи triggered: ${count}`)
    const finished = await client.incr(`triggered:done:${jobId}`)

    if (finished == countT[difficulty - 1]) {
        const data = await client.hGetAll(`triggered:${jobId}`)

        const totalCount = data.count
        const totalSum = data.sum

        await triggResults(totalCount, totalSum, taskTime, jobId)
        await isRightTriggered(jobId)

        await triggeredResIntoUsers()
    }

    await client.lRem('triggered-processing', 0, task)

    return

}


