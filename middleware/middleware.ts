const { graphqlHTTP } = require('express-graphql');

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));