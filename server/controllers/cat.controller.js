const Category = require("../models/CategoryModel");
const logger = require("../../logger")


module.exports = {
  // handle create Category

  createCategory: async (req, res) => {

    try {
      const categories = await Category.find();

      // validate inputs
      let { title } = req.body;

      if (!title.trim()) {
        throw new Error("Category name is required");
      }

      categories.forEach((item) => {
        if (item.title.toLowerCase() === title.toLowerCase()) {
          throw new Error("This category already exists");
        }
      });

      const category = await Category.create({ title });
      return res.status(201).json(category);
    } catch (error) {
      logger.error(error);
      return res.status(422).json({ error: error.message });
    }

  },

  viewAll: async (req, res) => {
    try {
      const allCat = await Category.find();
      res.status(200).json(allCat);
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  },

  viewOneCategory: async (req, res) => {
    
    try {
      const singleCategory = await Category.findById(req.params.id);
      logger.info(singleCategory)
      res.status(200).json(singleCategory);
    } catch (error) {
      console.log(error);
       return res.status(500).json({ msg: "Internal server error" });
    }
  },

  // Edit Category Handler
  editCategory: async (req, res) => {
    try {
      const updatedCategory = 
      await Category.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
 
      res.status(201).json(updatedCategory)
    } catch (err) {
      logger.error(err);
      return res.status(500).json({msg: "Internal Server Error"})
    }
  },

  deletecat: async (req, res) => {
   try {
     const deletedCategory = await Category.findByIdAndDelete(req.params.id);

     if (deletedCategory) {
       return res.status(200).json({ msg: "Category Deleted" });
     } else {
       return res.status(200).json({ msg: "Category Doesn't Exist" });
     }
   } catch (error) {
     logger.error("Error deleting category:", error);
     return res.status(500).json({ msg: "Internal Server Error" });
   }

  },
};
