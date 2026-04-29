import { createHash } from 'crypto'
export function shaFunc(text, prefix, start, end) {
    let i = start

    while (i < end) {
        const hash = createHash('sha256')
            .update(`${text}${i}`)
            .digest('hex')

        if (hash.startsWith(prefix)) {
            return {
                found: true,
                value: i,
                hash
            }
        }

        i++
    }

    return {
        
        found: false
    }
}