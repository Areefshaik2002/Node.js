export const ROLES_LIST = {
    Admin: 5150,
    Editor: 1984,
    User: 2001
} as const

export type roleCode = typeof ROLES_LIST[keyof typeof ROLES_LIST]