module.exports.aboutPage = async (req, res) => {

   try {

      res.render("./defaultPages/About_us", {
        title: "FintechBlog: About Us",
        layout: "../layouts/public_layout",
      });
    
   } catch (error) {
     console.log(error)
   }
};

module.exports.homepage = async (req, res) => {

   try {

      res.render("./defaultPages/Home_Page", {
        title: "FintechBlog: Home Page",
        layout: "../layouts/public_layout",
      });
    
   } catch (error) {
     console.log(error)
   }
};