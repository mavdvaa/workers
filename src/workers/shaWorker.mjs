import { createClient } from 'redis'
import { createHash } from 'crypto'
import { verify } from '../crypto/cryptoPackage.mjs'
import { step } from '../scaling/scaling.mjs'
import { userVerification } from '../db/db.mjs'
import { shaResIntoUsers, shaResults } from '../db/shaDb.mjs'
import { checkResSha } from '../db/isRightDB.mjs'


const client = createClient()
if (!client.isOpen) {
    await client.connect().catch(console.error);
}

async function startSha() {
    while(true) {
        try {
            await processShaTask()
        } catch(e) {
            console.log(e)
        }
    }
}

startSha()

// воркер sha
export async function processShaTask() {

    const workerId = `Agent-${Math.random().toString(36).substring(7)}`;

    const task = await client.brPopLPush('sha-task', 'sha-processing', 1);

    if (!task) return

    const data = JSON.parse(task);
    const { signature, publicKey, text, userId, difficulty, jobId, start, end, timeStartSHA } = data

    const dataToVerify = { userId, text, difficulty, timeStartSHA }

    const checkUserSHA = await userVerification(userId)
    const checkDifficiltySHA = (difficulty > 0 && difficulty < 5) ? true : false

    if (!checkDifficiltySHA) {
        console.log('НЕправильная сложность')
        return null
}

    if (!checkUserSHA) {
        console.log(`Пользователя с id ${userId} не существует` )
        return null
    }

    const isVerified = verify(dataToVerify, signature, publicKey)

    if (!isVerified) {
        console.log('Подпись для задачи sha не прошла проверку')
        return null
    }

    const prefix = '0'.repeat(parseInt(difficulty))

    let fStart = start

    while (fStart < end) {
        const done = await client.get(`Завершена ${jobId}`)
        if (done) {
            break
        }
        const hash = createHash('sha256')
            .update(`${text}${fStart}`)
            .digest('hex')

        if (hash.startsWith(prefix)) {
            const taskTimeSHA = (Date.now() - timeStartSHA) / 1000 
            console.log(`Worker ${workerId} завершил ${fStart - start} из ${step[difficulty - 1]} попыток для задачи sha. Результат: ${hash}`)
            await client.setEx(`Завершена ${jobId}`, 60, "true")

            await shaResults(prefix, hash, taskTimeSHA, jobId)
            await checkResSha(jobId, prefix.length, prefix)
            await shaResIntoUsers()

            break
        }

        if (fStart % 1000 == 0) {
            console.log(`worker ${workerId} закончил попытку ${fStart} для задачи sha`)
        }
        fStart++
    }

    await client.lRem('sha-processing', 0, task)
    return
}





