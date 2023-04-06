export const validateEmail = (email: string) => {
  const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  return emailPattern.test(email)
}

export function isNullOrEmpty(str: string) {
  return !str || str.length === 0
}
