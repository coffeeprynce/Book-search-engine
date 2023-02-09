const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
        const foundUser = await User.findOne({
   _id: context.user._id,
        });
    
        if (!foundUser) {
           throw new AuthenticationError("Not logged in")
        }
    
        return(foundUser);
      },
  },
  Mutation: {
         login: async (parents, args) => {
        const user = await User.findOne({ $or: [{ username: args.username }, { email: args.email }] });
        if (!user) {
           throw new AuthenticationError("Invalid user")
        }
    
        const correctPw = await user.isCorrectPassword(args.password);
    
        if (!correctPw) {
            throw new AuthenticationError("Invalid credentials")
        }
        const token = signToken(user);
        return({ token, user });
      },
       createUser: async (parent, args) => {
        const user = await User.create(args);
    
        if (!user) {
            throw new AuthenticationError("Something went wrong")
        }
        const token = signToken(user);
        return({ token, user });
      },
      saveBook: async ( parents, args, context) => {
       
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: args.bookdata } },
            { new: true, runValidators: true }
          );
          return (updatedUser);
        } catch (err) {
          console.log(err);
          throw new AuthenticationError("Something went wrong")
        }
      },
      deleteBook: async (parent, args, context) => {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );
        if (!updatedUser) {
            throw new AuthenticationError("Something went wrong")
        }
        return (updatedUser);
      },
  },
};

module.exports = resolvers;