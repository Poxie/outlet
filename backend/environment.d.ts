declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            FRONTEND_ORIGIN: string;
            BCRYPT_SALT_ROUNDS: string;
            JWT_PRIVATE_TOKEN: string;
        }
    }
    namespace Express {
        interface Locals {
            userId?: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}