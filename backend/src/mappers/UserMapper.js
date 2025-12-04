export function toUserResponse(user) {
  return {
    id: user._id,
    username: user.username,
    role: user.role,
  }
}