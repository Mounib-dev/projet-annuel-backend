type SuccessResponse = {
  message: string;
};

export const userRoleChangeSuccess = (): SuccessResponse => {
  return { message: "User role successuflly changed." };
};
