import bcrypt from 'bcryptjs';

// Function to hash a password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Cost factor for bcrypt hashing
  return await bcrypt.hash(password, saltRounds);
};

// Function to compare a plain password with a hash
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};