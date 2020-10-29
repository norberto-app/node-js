const request = require("supertest");
const { Customer } = require("../../models/customer");
const { User } = require("../../models/user");

jest.setTimeout(30000);

let server;

describe("api/customers", () => {
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await Customer.remove({});
  });

  describe("GET /", () => {
    it("should return all customers", async () => {
      await Customer.collection.insertMany([
        { name: "customer 1", phone: "123456789", isGold: true },
        { name: "customer 2", phone: "234567891", isGold: true },
      ]);

      const res = await request(server).get("/api/customers");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].name === "customer 1").toBeTruthy();
      expect(res.body[1].name === "customer 2").toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a customer if valid id is passed", async () => {
      const customer = new Customer({
        name: "customer 1",
        phone: "123456789",
        isGold: true,
      });
      await customer.save();

      const res = await request(server).get("/api/customers/" + customer._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", customer.name);
    });

    it("should return 404 if invalid Id is passed", async () => {
      const res = await request(server).get("/api/customers/1");

      expect(res.status).toBe(404);
    });
  });

  describe("POST /:id", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server)
        .post("/api/customers/")
        .send({ name: "customer 1", phone: "123", isGold: true });

      expect(res.status).toBe(401);
    });

    it("should return 400 if client name is less than 5 characters length", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/customers/")
        .set("x-auth-token", token)
        .send({ name: "cust" });

      expect(res.status).toBe(400);
    });

    it("should save the customer if it is valid", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/customers/")
        .set("x-auth-token", token)
        .send({ name: "customer 1", phone: "123", isGold: false });

      const customer = await Customer.find({ name: "customer 1" });

      expect(customer).not.toBeNull();
    });

    it("should return the customer if it is valid", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/customers/")
        .set("x-auth-token", token)
        .send({ name: "customer 1", phone: "123", isGold: false });

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "phone", "isGold");
    });
  });
});

module.exports = {
  testEnvironment: "node",
};
