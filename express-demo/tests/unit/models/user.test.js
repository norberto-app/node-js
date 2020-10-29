const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("generate user token", () => {
  it("should return a valid JWT", () => {
    const userPayload = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(userPayload);
    const token = user.generateAuthToken();

    const decodedToken = jwt.verify(token, config.get("jwtPrivateKey"));

    expect(decodedToken).toMatchObject(userPayload);
  });
});
