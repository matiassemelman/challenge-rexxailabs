declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                // Additional user properties can be added here
            };
        }
    }
}

// This export is needed to make the file a module
export { };