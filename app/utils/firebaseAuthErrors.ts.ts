// utils/firebaseAuthErrors.ts

import { FirebaseError } from "firebase/app"

export function translateFirebaseAuthError(error: unknown): string {

  if(!(error instanceof FirebaseError)) return 'Erro inesperado.'

  const errors: Record<string, string> = {
    "auth/invalid-email": "E-mail inválido.",
    "auth/user-disabled": "Este usuário foi desativado.",
    "auth/user-not-found": "Usuário não encontrado.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/email-already-in-use": "Este e-mail já está em uso.",
    "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
    "auth/operation-not-allowed": "Operação não permitida.",
    "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
    "auth/network-request-failed": "Erro de conexão. Verifique sua internet.",
    "auth/invalid-credential": "Credenciais inválidas.",
    "auth/account-exists-with-different-credential":
      "Já existe uma conta com este e-mail usando outro método de login.",
    "auth/popup-closed-by-user": "Login cancelado pelo usuário.",
    "auth/cancelled-popup-request": "Solicitação de login cancelada.",
    "auth/requires-recent-login":
      "Faça login novamente para continuar.",
  }

  return errors[error.code] || "Erro de autenticação. Tente novamente."
}
