const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
  }));