const sampleV2Transaction = {
  siacoinInputs: [
    {
      parent: {
        id: 'b85855d62669ee2d5a8f2d07596b94eaf9326da191a3f37079f7ba50703f5d76',
        stateElement: {
          leafIndex: 4212261,
          merkleProof: [
            '654da0a9fedeeeabe62b111de11c9b1eaaa50b2887928598fff131a5fe2dc491',
            '4dde9b9bddf5ca1d2d5a5d0c60d9943a9b87519f76bb6bd9911d14488fb3502e',
            'aed295802db4cd129a13820cad013c3fbb1a187278ed926f88b1b28c3a004def',
            '86c0698df01e6c0b5f4b73e08c8a2bfb46485c59d2616a765121ea2a2e25040e',
            'cdeaa561d784513385589e083ec91880d8b8e687d92c9af6bca7f330ee949769',
            'b34fb7d0ef1a288ad4bf5d32dffe77229f7b25a97a78c5be55c84d53a0e8c768',
            '4dae48fae2cf64eb7b0f8ede8f5460c1b515987fc64ad25774c82ca4a1ee16cd',
            'bb28285ee1c05a5b70cef08ed1c56aa04a8b41c2621f10d25e556f2201e2487e',
            'f4d8c14e6d7e5f44eaf866ab59be1ab4fd57c10e0a3b3447d75420b5f68b343c',
            '3f72548013bc16f638a571ce46eea2c8398aeb4d2e9504880157a54258fe9443',
            '5295cec9cb15a03b646ecd6fc89ac0bd858241fcae1a16f63bae821ebcfb5810',
            '2cee110f9af06d68f8ee0b805fc8ea615c544a3f5c67524a8ddf00a67019b629',
          ],
        },
        siacoinOutput: {
          value: '49959936070000000000000000000',
          address:
            '1a65c72390ada356e604ba3c7e6696470cb9fbf68fe5e895e425279fb5810a6e17a453e3cebb',
        },
        maturityHeight: 0,
      },
      satisfiedPolicy: {
        policy: {
          type: 'uc',
          policy: {
            timelock: 0,
            publicKeys: [
              'ed25519:0a947c0169aecf6ea0e1488e8f30cc16c9a8470031cc4cce1cbbdc9511504ef2',
            ],
            signaturesRequired: 1,
          },
        },
      },
    },
  ],
  siacoinOutputs: [
    {
      value: '4000000000000000000000000',
      address:
        'fc9bc3482711e9f83642d07be385c0d434892245842b4c3f3b83b26d42cec15fe1aaac1be1ff',
    },
    {
      value: '49955916070000000000000000000',
      address:
        '1a65c72390ada356e604ba3c7e6696470cb9fbf68fe5e895e425279fb5810a6e17a453e3cebb',
    },
  ],
  minerFee: '20000000000000000000000',
}

module.exports = {
  sampleV2Transaction,
}
