import type { Decrypter } from '@/data/protocols/criptography/decrypter'
import type { Encrypter } from '@/data/protocols/criptography/encrypter'
import type { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import type { Hasher } from '@/data/protocols/criptography/hasher'
import { faker } from '@faker-js/faker'

export class DecrypterSpy implements Decrypter {
  private readonly defaultPlaintext: string = faker.internet.password()

  public ciphertext: string
  public plaintext: string | null = this.defaultPlaintext

  async decrypt(ciphertext: string): Promise<string | null> {
    this.ciphertext = ciphertext
    return await Promise.resolve(this.plaintext)
  }

  reset(): void {
    this.plaintext = this.defaultPlaintext
  }
}

export class EncrypterSpy implements Encrypter {
  public plaintext: string
  public ciphertext: string = faker.string.uuid()

  async encrypt(plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return await Promise.resolve(this.ciphertext)
  }
}

export class HashComparerSpy implements HashComparer {
  private readonly defaultIsValid: boolean = true

  public plaintext: string
  public digest: string
  public isValid: boolean = this.defaultIsValid

  async compare(plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext
    this.digest = digest
    return await Promise.resolve(this.isValid)
  }

  reset(): void {
    this.isValid = this.defaultIsValid
  }
}

export class HasherSpy implements Hasher {
  public plaintext: string
  public digest: string = faker.string.uuid()

  async hash(plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return await Promise.resolve(this.digest)
  }
}
