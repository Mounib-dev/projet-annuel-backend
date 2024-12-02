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

export const generateNoPermissionsErrorMessage = (): ErrorResponse => {
  return { message: "You don't have permission." };
};

export const generateNotFoundUsersErrorMessage = (): ErrorResponse => {
  return { message: "Users not found." };
};

export const generateNotFoundUserErrorMessage = (): ErrorResponse => {
  return { message: "User not found." };
};
