const Product = require("../models/Product");
const path = require("path");
const gracefulFs = require("graceful-fs");
const { HttpStatus, ResponseEntity, Message } = require("../dto/dataResponse");


// query: category_id, name, min_price, max_price, page(default=1), limit(default=10)
module.exports.getAllProducts = async (req, res) => {
  const conditions = {};

  // category_id
  if (req.query.category_id) {
    conditions.category = req.query.category_id;
  }

  /*== Find if name is not empty with regex ==*/
  // name
  if (req.query.name) {
    conditions.name = new RegExp(req.query.name, "ig");
  }

  /*== Find with price between min_price and max_price ==*/
  // min_price
  if (req.query.min_price) {
    if (!conditions.price) {
      conditions.price = {};
    }
    conditions.price.$gte = req.query.min_price;
  }

  // max price
  if (req.query.max_price) {
    if (!conditions.price) {
      conditions.price = {};
    }
    conditions.price.$lte = req.query.max_price;
  }

  // page, limit
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const startIndex = (page - 1) * limit;
  const total = await Product.countDocuments(conditions);
  const totalPage = Math.ceil(total / limit);
  // const pagination = {
  //   page,
  //   limit,
  //   total,
  //   totalPage,
  // };

  const products = await Product.find(conditions).skip(startIndex).limit(limit);

  res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, products));
};

module.exports.getProductById = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(
        new ResponseEntity(
          HttpStatus.NOT_FOUND,
          `Product not found by id: ${productId}`
        )
      );
  }

  res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, product));
};

module.exports.createNewProduct = async (req, res, next) => {
  const product = new Product(req.body);
  const file  = req.file;

  
  if (!(product.name && product.price && product.stock))
    return next(new ErrorResponse(400, "Missing information"));

  if(file) {
    if (isDenyMimeType(file.mimetype)) {
      throw new ResponseError(400, "File type not allowed");
    }
    const fileName = randomFileName(file.originalname);
    gracefulFs.writeFile(
      path.join(__dirname, `../public/uploads/${fileName}`),
      file.buffer,
      { encoding: "utf-8" },
      async (err) => {
        if (err) {
          // chỗ này không throw được nên phải dùng next
          // vì function này là call back
          return next(new ResponseError(500, "File cannot be written"));
        }
        product.image.push(`/uploads/${fileName}`);
        // sau khi ghi file thành công thì lưu bản ghi vào db
        const newProduct = await Product.create({
          title: body.title,
          content: body.content,
          image: `/uploads/${fileName}`,
        });
  
        res.status(201).json(newProduct);
      }
    );

  }

  const newProduct = await Product.create(product);

  res
    .status(HttpStatus.CREATED)
    .json(new ResponseEntity(HttpStatus.CREATED, Message.SUCCESS, newProduct));
};


module.exports.editProductById = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body);

  res
  .status(HttpStatus.OK)
  .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, product));
}

module.exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findByIdAndDelete(productId);

  res
  .status(HttpStatus.OK)
  .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, product));
}