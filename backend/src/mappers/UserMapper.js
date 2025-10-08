export function toUserResponse(user) {
  return {
    username: user.username,
    role: user.role,
  }
}