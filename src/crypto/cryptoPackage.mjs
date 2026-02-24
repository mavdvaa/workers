import { generateKeyPairSync, createSign, createVerify } from 'crypto'

export function verify(data, signature, publicKey) {
  const verifier = createVerify('SHA256')
  verifier.update(JSON.stringify(data))
  verifier.end()

  return verifier.verify(publicKey, signature, 'hex')
}