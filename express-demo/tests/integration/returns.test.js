const mongoose = require("mongoose");
const request = require("supertest");
const moment = require("moment");
const { User } = require("../../models/user");
const { Movie, Genre } = require("../../models/movie");
const { Rental } = require("../../models/rental");

describe("api/renturns", () => {
  let server;
  let token;
  let customerId;
  let movieId;
  let rental;

  let genre;
  let movie;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index");
    token = User().generateAuthToken();
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    genre = new Genre({
        _id: mongoose.Types.ObjectId(),
        name: "12345"
    });

    await genre.save();

    movie = new Movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: genre._id,
      numberInStock: 10,
    });

    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
        isGold: false,
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });

    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    await Rental.remove({});
    await Genre.remove({});
    await Movie.remove({});
  });

  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if customer Id is not provided", async () => {
    customerId = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if movie Id is not provided", async () => {
    movieId = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental found for this customer/movie", async () => {
    await Rental.remove({});
    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("should return 400 if rental is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if the request is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should set the dateReturned if request is valid.", async () => {
    const diff = new Date().getTime();

    const res = await exec();
    const processedRental = await Rental.findById(rental._id);

    expect(res.status).toBe(200);
    expect(diff).toBeLessThan(processedRental.dateReturned.getTime());
  });

  it("should set the rentalFee if request is valid.", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();

    const res = await exec();
    const processedRental = await Rental.findById(rental._id);

    expect(res.status).toBe(200);
    expect(processedRental.rentalFee).toBe(14);
  });

  it("should increase the movie stock if request is valid", async () => {
    const res = await exec();
    const rentedMovie = await Movie.findById(movieId);

    expect(res.status).toBe(200);
    expect(rentedMovie.numberInStock).toBe(movie.numberInStock + 1);
  });

  it("should return the rental if request is valid", async () => {
    const res = await exec();
    const updatedRental = await Rental.findById(rental._id);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("dateOut", "dateReturned", "rentalFee", "customer", "movie");
  });

});