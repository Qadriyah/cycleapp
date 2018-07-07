const people = [];
let person = {};
const members = [];
let member = {};
const db = {};

const resolvers = {
  Query: {
    people: () => {
      return people;
    },

    members: () => {
      return members;
    }
  },
  Mutation: {}
};

module.exports = resolvers;
