import { createClient } from 'redis'
import { rightNumber, notRightNumber, periodicResIntoUsers } from '../db/periodicDb.mjs'
import { verify } from '../crypto/cryptoPackage.mjs'
import { userVerification } from '../db/db.mjs'
import { isRightReriodic } from '../db/isRightDB.mjs'
import { perFunc } from '../functions/periodicFunction.mjs'


const client = createClient()
if (!client.isOpen) {
    await client.connect().catch(console.error);
}

async function startPeriodic() {
    while(true) {
        try {
            await processPeriodicTask()
        } catch(e) {
            console.log(e)
        }
    }
}

startPeriodic()

//perodic

async function processPeriodicTask() {

    const task = await client.brPopLPush('periodic-task', 'periodic-processing', 1)
    if (!task) return 

    const data = JSON.parse(task)

    const { signature: signature, publicKey: publicKey, jobId: jobId, ...dataToVerify } = data
    const { userId, check, timeStartPeriod } = dataToVerify
    const isVerified = verify(dataToVerify, signature, publicKey)

    const checkUserPeriod = await userVerification(userId)

    if (!checkUserPeriod) {
        console.log(`Periodic task: пользователь с id ${userId} не может выполнить задание, он не зарегистрирован.`)
        return null
    }


    if (!isVerified) {
        console.log("Подпись для задачи periodic не прошла проверку")
        return null
    }

    let number = check
    const length = number.toString().length
    let j = perFunc(length, number)

    if (j) {
        const taskTimePeriod = (Date.now() - timeStartPeriod) / 1000
        console.log(`Число ${number} является числом Армстронга`)
        await rightNumber(taskTimePeriod, jobId)

    } else {
        const taskTimePeriod = (Date.now() - timeStartPeriod) / 1000
        console.log(`число ${number} не является числом Армстронга`)
        await notRightNumber(taskTimePeriod, jobId)
    }

    await isRightReriodic(jobId)

    await periodicResIntoUsers()
    console.log('Задание periodic выполнено')

    await client.lRem('periodic-processing', 0, task)
    return

}

