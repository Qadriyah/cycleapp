const { makeExecutableSchema } = require("graphql-tools");
const resolvers = require("./resolvers");

const typeDefs = `
    type Person {
        personId: Int
        firstName: String!
        lastName: String!
        gender: Gender
        title: String
        fullName: String
        statusFlag: Int
    }

    type User {
        userId: Int
        personId: Int
        userName: String!
        password: String!
        dateCreated: String
        statusFlag: Int
    }

    type Member {
        memberId: Int
        personId: Int
        dateModified: String
    }

    enum Gender {
        Male
        Female
        Other
    }

    type Query {
        person: Person
        user: User
        people: [Person]
        members: [Member]
    }

    input personInput {
        personId: Int
        firstName: String!
        lastName: String!
        gender: Gender
        title: String
        fullName: String
        statusFlag: Int
    }

    input memberInput {
        memberId: Int
        personId: Int
        dateModified: String
    }

    type Mutation {
        getPerson(id: Int) : Person
        createPerson(input: personInput) : Person
    }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
module.exports = schema;
