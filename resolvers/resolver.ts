const root = {
    product: async ({ id }) => await Product.findById(id),
    products: async () => await Product.find(),
    createProduct: async ({ name, price, description }) => {
      const product = new Product({ name, price, description });
      await product.save();
      return product;
    },
  };