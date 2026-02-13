const app = require("../../app");
const request = require("supertest");
const { loadPlanetsData } = require("../../models/planets.model");

describe("TEST GET /planets", () => {
  beforeAll(async () => {
    await loadPlanetsData(); // <-- THIS FIXES THE EMPTY ARRAY
  });
  test("It should return a list of habitable planets", async () => {
    const res = await request(app)
      .get("/planets")
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
