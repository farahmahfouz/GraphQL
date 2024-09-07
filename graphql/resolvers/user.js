const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const secret = "yourSecretKey";

const userQueries = {
  usersGetAll: async () => {
    const users = await User.find().populate("posts");
    return users;
  },
};

const userMutations = {
  usersCreate: async (_, { input }) => {
    const { name, email, password } = input;
    const hashedPassword = await bcrypt.hash(password, 12);
    const createdUser = new User({ name, email, password: hashedPassword });
    await createdUser.save();
    return createdUser;
  },
  usersLogin: async (_, { email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error("Invalid credentials");

    const token = jwt.sign({ userId: user._id }, secret);
    return token;
  },
};

module.exports = {
  Query: userQueries,
  Mutation: userMutations,
};
