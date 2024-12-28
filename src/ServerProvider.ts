export interface User {
  email: string;
  name: string;
  avatar: string;
}

export interface Auth {
  getUser(): Promise<User | null>;
  createUser(email: string, password: string): Promise<User>;
}

export interface ServerProvider {
  auth: Auth;
}
