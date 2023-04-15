import { JwtTokenGenerator } from '@/infra/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let fakeJwt: jest.Mocked<typeof jwt>
  let key: string
  let expirationInMs: number
  let anySecret: string

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    fakeJwt.sign.mockImplementation(() => 'any_token')
    key = 'any_key'
    expirationInMs = 1000
    anySecret = 'any_secret'
  })

  beforeEach(() => {
    sut = new JwtTokenGenerator(anySecret)
  })

  it('should call sign with correct params', async () => {
    await sut.generateToken({ key, expirationInMs })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, anySecret, { expiresIn: 1 })
  })

  it('should return a token', async () => {
    const token = await sut.generateToken({ key, expirationInMs })

    expect(token).toBe('any_token')
  })

  it('should rethrow if sign throws', async () => {
    fakeJwt.sign.mockImplementation(() => { throw new Error('token_error') })

    const promise = sut.generateToken({ key, expirationInMs })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
