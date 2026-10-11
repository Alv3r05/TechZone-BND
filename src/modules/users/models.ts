import prisma from "../../db/prisma";

export type UserRow = NonNullable<
    Awaited<ReturnType<typeof prisma.users.findUnique>>
>;

export interface UserPublic {
    id: number;
    name: string;
    username: string;
    email: string;
}

export interface NewUser {
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface RegisterInput {
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface LoginInput {
    username: string;
    password: string;
}

export interface AuthResponse {
    user: UserPublic;
    token: string;
}
