const Category = require("../models/Category.model");
const { HttpStatus, ResponseEntity, Message } = require("../dto/dataResponse");
const ResponseError = require("../helpers/ResponseError");

module.exports.getAllCategories = async (req, res) => {
  const categories = await Category.find();
  if (!categories.length) {
    res
      .status(HttpStatus.NOT_FOUND)
      .json(
        ResponseEntity(HttpStatus.NOT_FOUND, Message.NO_CONTENT, categories)
      );
  }

  res
    .status(HttpStatus.Ok)
    .json(ResponseEntity(HttpStatus.Ok, Message.SUCCESS, categories));
};

module.exports.getCategoryById = async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) {
    res
      .status(HttpStatus.NOT_FOUND)
      .json(ResponseEntity(HttpStatus.NOT_FOUND, Message.NO_CONTENT, category));
  }

  res
    .status(HttpStatus.Ok)
    .json(ResponseEntity(HttpStatus.Ok, Message.SUCCESS, category));
};

module.exports.editCategory = async (req, res, next) => {
  const { id } = req.body;
  const { name, description, thumbnail } = req.body;
  let editedCategory;
  if (name) editedCategory.name = name;
  if (description) editedCategory.description = name;
  if (thumbnail) editedCategory.description = name;
  const category = await Category.findByIdAndUpdate({ id, editedCategory });

  res
    .status(HttpStatus.OK)
    .json(ResponseEntity(HttpStatus.OK, Message.SUCCESS, category));
};

module.exports.createCategory = async (req, res, next) => {
  const { name } = req.body;
  const existCategory = await Category.find({ name });
  if (existCategory)
    return next(new ErrorResponse(400, `Category ${name} is existed!`));
  const category = await Category.create(req.body);
  res
  .status(HttpStatus.CREATED)
  .json(ResponseEntity(HttpStatus.CREATED, Message.SUCCESS, category));
};

module.exports.deleteCategory = async (req, res, next) => {
  const id = req.params.id;
  const category = await Category.findByIdAndDelete(id);

  if(!category)
    return next(new ErrorResponse(400, `Category is not exist!`));
  res
  .status(HttpStatus.OK)
  .json(ResponseEntity(HttpStatus.OK, Message.SUCCESS, category));
}
