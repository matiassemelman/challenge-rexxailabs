declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                // You could add other user properties here if needed from the JWT payload
            };
        }
    }
}

// This export is needed to make the file a module and ensure the declaration merging works.
// It doesn't actually export anything, but it satisfies TypeScript's module requirement.
export { };