import Admin from "../models/admin"

export function isAdminValid(req) {
  if (!req.user) {
    return false;
  }

  const { status, emailVerified, disabled } = req.user;

  if (
    status !== "accept" ||     
    !emailVerified ||          
    disabled                   
  ) {
    return false;
  }

  return true;
}

export const authenticate = (req, res, next) => {
    // check JWT, decode user, attach to req.user
    next();
};