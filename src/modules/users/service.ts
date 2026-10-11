import bcrypt from 'bcrypt';
import repo from './repository';
import auth from '../../middleware/auth';
import error from '../../utils/error';
import {
    UserPublic,
    RegisterInput,
    LoginInput,
    AuthResponse,
} from './models';

const SALT_ROUNDS = 10;

export async function list(): Promise<UserPublic[]> {
    return repo.getAll();
}

export async function getById(id: number | string): Promise<UserPublic> {
    const user = await repo.getById(id);
    if (!user) {
        throw error('User not found', 404);
    }
    return user;
}

export async function register({ name, username, email, password }: RegisterInput): Promise<AuthResponse> {
    if (!name || !username || !email || !password) {
        throw error('Missing required fields', 400);
    }

    if (name.trim().length < 15) {
        throw error('Name must be at least 15 characters long', 400);
    }
    if (username.trim().length < 10) {
        throw error('Username must be at least 10 characters long', 400);
    }
    if (password.trim().length < 8) {
        throw error('Password must be at least 8 characters long', 400);
    }

    const emailRegex = /^[^\s@]+@(gmail|hotmail|outlook|yahoo|icloud)\.(com|es|pe)$/i;
    if (!emailRegex.test(email)) {
        throw error('Invalid email address', 400);
    }

    if (await repo.getByUsername(username)) {
        throw error('Username is already in use', 409);
    }
    if (await repo.getByEmail(email)) {
        throw error('Email is already registered', 409);
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const id = await repo.insert({ name, username, email, password: hashed });
    const token = auth.sign({ id, username });

    return {
        user: { id, name, username, email },
        token,
    };
}

export async function login({ username, password }: LoginInput): Promise<AuthResponse> {
    if (!username || !password) {
        throw error('Missing required fields', 400);
    }

    const user = await repo.getByUsername(username);
    if (!user) {
        throw error('Invalid credentials', 401);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw error('Invalid credentials', 401);
    }

    const token = auth.sign({ id: user.id, username: user.username });
    return {
        user: { id: user.id, name: user.name, username: user.username, email: user.email },
        token,
    };
}

export async function update(
    id: number | string,
    { name, username, email, password }: RegisterInput
): Promise<UserPublic> {
    if (!name || !username || !email || !password) {
        throw error('Missing required fields', 400);
    }

    const byUsername = await repo.getByUsername(username);
    if (byUsername && Number(byUsername.id) !== Number(id)) {
        throw error('Username is already in use', 409);
    }
    const byEmail = await repo.getByEmail(email);
    if (byEmail && Number(byEmail.id) !== Number(id)) {
        throw error('Email is already registered', 409);
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const affected = await repo.update(id, { name, username, email, password: hashed });

    if (affected === 0) {
        throw error('User not found', 404);
    }

    return { id: Number(id), name, username, email };
}

export async function remove(id: number | string): Promise<{ message: string }> {
    const affected = await repo.remove(id);
    if (affected === 0) {
        throw error('User not found', 404);
    }
    return { message: 'User deleted successfully' };
}

export default { list, getById, register, login, update, remove };
