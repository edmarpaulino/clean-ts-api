import type { Decrypter } from '@/data/protocols/criptography/decrypter'
import type { Encrypter } from '@/data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(plaintext: string): Promise<string> {
    const ciphertext = jwt.sign({ id: plaintext }, this.secret)
    return ciphertext
  }

  async decrypt(ciphertext: string): Promise<string | null> {
    const plaintext = jwt.verify(ciphertext, this.secret) as string
    return plaintext
  }
}
