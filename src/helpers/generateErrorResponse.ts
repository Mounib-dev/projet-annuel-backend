type ErrorResponse = {
  message: string;
};

export const generateInternalServerErrorMessage = (): ErrorResponse => {
  return { message: "Sorry something went wrong with the server." };
};

export const generateUnmatchedPasswordsErrorMessage = (): ErrorResponse => {
  return { message: "Passwords don't match." };
};

export const generateUsedEmailErrorMessage = (): ErrorResponse => {
  return { message: "Email already used." };
};

export const generateInvalidCredentialsErrorMessage = (): ErrorResponse => {
  return { message: "Invalid email or password." };
};

export const generateUnauthorizedErrorMessage = (): ErrorResponse => {
  return { message: "Unauthorized." };
};
