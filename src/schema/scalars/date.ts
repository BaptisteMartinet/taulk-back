import { GraphQLScalarType, Kind } from 'graphql';

const GraphQLDate = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value: unknown) {
    return (value as Date).getTime(); // Convert outgoing Date to integer for JSON
  },
  parseValue(value: unknown) {
    return new Date(value as number); // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      return new Date(parseInt(ast.value, 10));
    }
    // Invalid hard-coded value (not an integer)
    return null;
  },
});

export default GraphQLDate;
