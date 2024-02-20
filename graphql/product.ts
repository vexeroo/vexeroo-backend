const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Product {
    id: ID
    name: String
    price: Float
    description: String
  }

  type Query {
    product(id: ID!): Product
    products: [Product]
  }

  type Mutation {
    createProduct(name: String, price: Float, description: String): Product
  }
`);