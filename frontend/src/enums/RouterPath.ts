export const RouterPath = {
    HOME: "/",
    ABOUT: "/about",
    CONTACT: "/contact",
    STAR: "/*",
    DIGITAL: "/digital",
    TRADITIONAL: "/traditional",
    WORKS: "/works",
    COLLECTIONS: "/collections",
    NOTFOUND: "/not-found",
    LOGIN: "/login",
    ADMIN: "/admin",
} as const;

export type RouterPath = typeof RouterPath[keyof typeof RouterPath];