import prisma from '../../db/prisma';
import { UserRow, UserPublic, NewUser } from './models';

export async function getAll(): Promise<UserPublic[]> {
    return prisma.users.findMany({
        select: { id: true, name: true, username: true, email: true },
    });
}

export async function getById(id: number | string): Promise<UserPublic | null> {
    return prisma.users.findUnique({
        where: { id: Number(id) },
        select: { id: true, name: true, username: true, email: true },
    });
}

export async function getByUsername(username: string): Promise<UserRow | null> {
    return prisma.users.findUnique({ where: { username } });
}

export async function getByEmail(email: string): Promise<UserRow | null> {
    return prisma.users.findUnique({ where: { email } });
}

export async function insert({ name, username, email, password }: NewUser): Promise<number> {
    const user = await prisma.users.create({ data: { name, username, email, password } });
    return user.id;
}

export async function update(id: number | string, { name, username, email, password }: NewUser): Promise<number> {
    const result = await prisma.users.updateMany({
        where: { id: Number(id) },
        data: { name, username, email, password },
    });
    return result.count;
}

export async function remove(id: number | string): Promise<number> {
    const result = await prisma.users.deleteMany({ where: { id: Number(id) } });
    return result.count;
}

export default {
    getAll,
    getById,
    getByUsername,
    getByEmail,
    insert,
    update,
    remove,
};
