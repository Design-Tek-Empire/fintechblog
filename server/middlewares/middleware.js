module.exports = {
  ensureLoggedin: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error", "Restricted, Please Login");
      return res.redirect("/secure/login");
    }
  },
  ensureGuest: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/d");
    }
  },
  usernameToLowerCase: (req, res, next) => {
    if (req.body.username) {
      req.body.username = req.body.username.toLowerCase().trim();
    }
    next();
  },

 
};
