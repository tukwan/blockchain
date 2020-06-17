declare module 'elliptic' {
  class EllipticCurve {
    constructor(preset: 'secp256k1')
    genKeyPair(): this
    keyFromPublic(publicKey: string, hex: 'hex'): this
    getPublic(): {
      encode(hex: string): string
    }
    sign(data: any): {}
    verify(data: string, {}): boolean
  }

  export { EllipticCurve as ec }
}
