
export function perFunc(length, number) {
    let j = 0
    let number1 = number
    for (let i = 0; i < length; i++) {

        j += (number1 % 10) ** length
        number1 = Math.trunc(number1 / 10)
    }

    return j == number
    
}