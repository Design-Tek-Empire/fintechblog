
module.exports = {

    dashboard: async (req, res)=>{
         res.render("./dashPages/dashboard", {
           title: "FintechBlog: Dashboard",
           layout: "../layouts/admin_layout",
         });
    }


}