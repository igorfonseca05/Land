import { User } from "firebase/auth";

export const mockUser = {
  uid: "ONIw5VGVOTXt25k58yyJXFOfBjm1",
  email: "teste@email.com",
  emailVerified: true,
  displayName: "Igor Ribeiro",
  photoURL: "https://i.pravatar.cc/150?img=3",
  phoneNumber: "+5511999999999",
  isAnonymous: false,

  providerData: [
    {
      providerId: "password",
      uid: "123456789",
      displayName: "Igor Ribeiro",
      email: "teste@email.com",
      phoneNumber: "+5511999999999",
      photoURL: "https://i.pravatar.cc/150?img=3",
    },
  ],

  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },

  // métodos obrigatórios (mockados)
  getIdToken: async () => "mock-token",
  getIdTokenResult: async () => ({
    token: "mock-token",
    expirationTime: new Date(Date.now() + 3600 * 1000).toISOString(),
    authTime: new Date().toISOString(),
    issuedAtTime: new Date().toISOString(),
    signInProvider: "password",
    claims: {},
  }),
  reload: async () => {},
  delete: async () => {},
  toJSON: () => ({}),

} as unknown as User;