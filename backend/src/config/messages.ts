export const register = {
  wrong: {
    emailRequired: "The email is required",
    emailInvalid: "Email invalid!!",
    passwordRequired: "The password is required",
    passwordLength: "The password must be at least 6 characters long",
    nameRequired: "The name is required",
    userAlreadyExists: "User Already Exist",
    userCreatedsuccesfully: "User created succesfully",
    internalServerError: "Internal Server Error",
    invalidVerificationCode: "Invalid or expired verification code",
    emailVerifiedSuccesfully: "Email verified successfully",
    userNotFound: "User not found",
    invalidPassword: "Invalid password",
    invalidOrExpiredResetTokenPassword: "Invalid or expired reset token password",
    unauthorized: "Unauthorized - no token provided or token is invalid"
  },
  success:{
    logOutSuccesfully: "Log out successfully",
    logInSuccesfully: "Log in successfully",
    resetPasswordEmailSent: "Reset password email sent",
    passwordResetSuccesfully: "Password reset succesfully"
  }
}

export const HtttpStatus = {
  BAD_REQUEST: 400,
  CREATED: 201,
  INTERNAL_SERVER_ERROR:  500,
  OK: 200,
  UNAUTHORIZED: 401
}