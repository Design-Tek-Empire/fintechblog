module.exports = {
  //
  authenticateUser: (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    } else {
      logger.warn("Login required");
      return res.status(422).json("Login is Required");
    }
  },
  // Ensure user hasn't logged in
  ensureGuest: (req, res, next) => {
    if (!req.session.isAuthorized) {
      return next();
    } else {
      res.redirect("/d/dashboard");
    }
  },

  // Should be an admin or Editor to have the ability
  isAdminOrEditor: (req, res, next) => {
    if (
      req.session.user &&
      ["Admin", "Editor"].includes(req.session.user.role)
    ) {
      next();
    } else {
      logger.warn("Higher Access Level Required");
      return res.status(422).json({ msg: "Higher Access Level Required" });
    }
  },

  mustBeAdmin: (req, res, next) => {
    if (req.session.user && req.session.user.role == "Admin") {
      next();
    } else {
      logger.fatal("Admin Access Required");
      return res.status(422).json({ msg: "Admin Access Required" });
    }
  },

  //Generate Access Token

  generateAccessToken: (user, jwt) => {
    return jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.ACCESS_TOKEN_SECRETE,
      { expiresIn: "1d" }
    );
  },

  mustBeAdminOrPartner: (req, res, next) => {
    if (
      req.session.user &&
      ["Admin", "Partner"].includes(req.session.user.role)
    ) {
      next();
    } else {
      logger.fatal("Admin or Partner Access Required");
      return res.status(422).json("Admin or Partner Access Required");
    }
  },

  authorizedUser: (req, res, next) => {
    if (
      req.session.user._id === req.params.id ||
      req.session.user.role == "Admin"
    ) {
      next();
    } else {
      logger.warn("Unauthorized Action");
      return res.status(422).json({ msg: "Unauthorized Action" });
    }
  },

  // Maintain case consistency
  usernameToLowerCase: (req, res, next) => {
    if (req.body.username) {
      req.body.username = req.body.username.toLowerCase().trim();
    }
    next();
  },
};
