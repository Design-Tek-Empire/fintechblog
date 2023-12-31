const Category = require("../models/CategoryModel");


module.exports = {
  // Get create category page
  createPage: async (req, res) => {
    res.render("./catPages/create", {
      title: "FintechBlog: Create Category",
      layout: "../layouts/admin_layout",
    });
  },
 // handle create Category   
  createCategory: async (req, res) => {
    try {

   
      const Categories = await Category.find();

      // validate inputs
      let { title } = req.body;

      let errors = [];
      if (title == "") {
        errors.push({ msg: "Category name is required" });
      }
     
      Categories.forEach((item) => {
        if (item.title.toLowerCase() == title.toLowerCase()) {
          errors.push({ msg: "This Category already exists" });
        }
      });

      if (errors.length > 0) {
         res.render("./catPages/create", {
           title: "FintechBlog: Create Category",
           layout: "../layouts/admin_layout",
           errors
         });
      } else {
        await Category.create({ title });
        req.flash("success_msg", "Category created");
        res.redirect("/categories/create");
      }
    } catch (error) {
      console.log(error);
    }
  },


  viewAll: async (req, res) => {
    try {
      const allCat = await Category.find();
      res.render("./catPages/categories", {
        title: "FintechBlog: Categories",
        layout: "../layouts/admin_layout",
        allCat,
      });
    } catch (error) {
      console.log(error);
    }
  },

  viewOneCategory: async (req, res) => {
    try {
      const singleCategory = await Category.findById(req.params.id);
        res.render("./catPages/singleCategory", {
          title: `FintechBlog: ${singleCategory.title}`,
          layout: "../layouts/admin_layout",
          singleCategory,
        });
  
    } catch (error) {
      console.log(error)
    }
  },
// Get category Edit Page
  editcatpage: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
       res.render("./catPages/editCategory", {
         title: `FintechBlog: ${category.title}`,
         layout: "../layouts/admin_layout",
         category,
       });
    } catch (error) {
      console.log(error);
    }
  },
// Edit Category Handler
  editCategory: async (req, res) => {
    try {
      await Category.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      req.flash("success_msg", "Category Edited Successfully");
      res.redirect(`/categories/${req.params.id}`);
    } catch (error) {
     console.log(error)
    }
  },

  deletecat: async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      req.flash("success_msg", "Category deleted Successfully");
      res.redirect("/categories");
    } catch (error) {
      console.log(error);
    }
  },
};
