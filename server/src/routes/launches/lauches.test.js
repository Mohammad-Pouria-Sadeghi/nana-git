// describe("TEST GET/LAUCNCHES", () => {
//   test("It should respond with 200 success", () => {
//     const response = 200;
//     expect(response).toBe(200);
//   });
// });

const app = require("../../app");
const request = require("supertest");

describe("TEST GET/LAUNCHES", () => {
  test("It should respond with 200 success", async () => {
    const res = await request(app).get("/launches");
    expect(res.statusCode).toBe(200);
  });
});

describe("TEST POST/LAUNCHES", () => {
  const compeleteLaunchData = {
    mission: "Pooria Enterpise",
    rocket: "Zuma",
    launchDate: "December 27, 2030",
    target: "Kepler-442 b",
  };

  const laucnhDataWithoutDate = {
    mission: "Pooria Enterpise",
    rocket: "Zuma",
    target: "Kepler-442 b",
  };

  test("It should respond with 201 success", async () => {
    const res = await request(app)
      .post("/launches")
      .send(compeleteLaunchData)
      .expect(201)
      .expect("Content-Type", /json/);

    const originalLaunchDate = new Date(
      compeleteLaunchData.launchDate,
    ).valueOf();
    const requestLaunchDate = new Date(res.body.launchDate).valueOf();

    if (originalLaunchDate === requestLaunchDate) {
      expect(res.body).toMatchObject(laucnhDataWithoutDate);
    }
  });

  test("catch missed properties", async () => {
    const res = await request(app).post("/launches").send({
      //   mission: "Pooria Enterpise",
      rocket: "Zuma",
      launchDate: "December 27, 2030",
      target: "Kepler-442 b",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: "Missing required launch property",
    });
  });

  test("catch invalid date", async () => {
    const res = await request(app)
      .post("/launches")
      .send({
        mission: "Pooria Enterpise",
        rocket: "Zuma",
        launchDate: "not a date",
        target: "Kepler-442 b",
      })
      .expect(400)
      .expect("Content-Type", /json/);

      expect(res.body).toStrictEqual({
        error: "Invalid launch date",
      });
  });
});
