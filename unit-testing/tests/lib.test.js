const { TestScheduler } = require("jest");
const lib = require("../lib");
const db = require("../db");
const mail = require("../mail");

test("absolute - should return positive number if input is positive", () => {
  const result = lib.absolute(1);
  expect(result).toBe(1);
});

test("absolute - should return positive number if input is negative", () => {
  const result = lib.absolute(-1);
  expect(result).toBe(1);
});

test("absolute - should return 0 number if input is 0", () => {
  const result = lib.absolute(0);
  expect(result).toBe(0);
});

describe("greet", () => {
  it("should return the greeting message", () => {
    const result = lib.greet("Norberto");

    expect(result).toMatch(/Norberto/);
    expect(result).toContain("Norberto");
  });
});

describe("get currencies", () => {
  it("should return supported currencies", () => {
    const result = lib.getCurrencies();

    // Too general assertion
    expect(result).toBeDefined();
    expect(result).not.toBeNull();

    // Too specific assertion
    expect(result[0]).toBe("USD");
    expect(result[1]).toBe("AUD");
    expect(result[2]).toBe("EUR");
    expect(result.length).toBe(3);

    // Proper way of testing currencies array
    expect(result).toContain("USD");
    expect(result).toContain("AUD");
    expect(result).toContain("EUR");

    // Ideal way
    expect(result).toEqual(expect.arrayContaining(["EUR", "USD", "AUD"]));
  });
});

describe("get product", () => {
  it("should return the product with the given Id", () => {
    const result = lib.getProduct(1);

    expect(result).toEqual({ id: 1, price: 10, name: "book" });
    expect(result).toMatchObject({ id: 1, price: 10 });
    expect(result).toHaveProperty("id", 1);
  });
});

describe("register user", () => {
  it("should throw if username is falsy", () => {
    const args = [null, undefined, NaN, "", 0, false];

    args.forEach((value) => {
      expect(() => {
        lib.registerUser(value);
      }).toThrow();
    });
  });

  it("should return a user object if valid username is passed", () => {
    const result = lib.registerUser("napp");

    expect(result).toMatchObject({ username: "napp" });
    expect(result.id).toBeGreaterThan(0);
  });
});

describe("apply discount", () => {
  it("should apply 10% discount if customer has more than 10 points", () => {
    db.getCustomerSync = function (customerId) {
      console.log("Mock customer ...");
      return { id: customerId, points: 25 };
    };

    const order = { customerId: 1, totalPrice: 10 };
    lib.applyDiscount(order);

    expect(order.totalPrice).toBe(9);
  });
});

// example showing how to mock functions

describe("notify customer", () => {
  it("should send an email to the customer", () => {
    db.getCustomerSync = jest
      .fn()
      .mockReturnValue({ email: "customeremail@test.com" });

    mail.send = jest.fn();

    lib.notifyCustomer({ customerId: 1 });

    expect(mail.send).toHaveBeenCalled();
    expect(mail.send.mock.calls[0][0]).toBe("customeremail@test.com");
    expect(mail.send.mock.calls[0][1]).toMatch(/order/);
  });
});
