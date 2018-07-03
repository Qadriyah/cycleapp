const people = [];
let person = {};
const members = [];
let member = {};
const db = {};
const MemberSchema = require("./models/Member");

const resolvers = {
  Query: {
    people: () => {
      return people;
    },

    members: () => {
      return members;
    }
  },
  Mutation: {
    createPerson: async (_, input) => {
      return await MemberSchema.create(input);
    },

    getPerson: ({ id }) => {
      return people.find(person => {
        person.personId === id;
      });
    }
  }
};

module.exports = resolvers;
