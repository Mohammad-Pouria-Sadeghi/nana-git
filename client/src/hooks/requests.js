const API_URL = "http://localhost:9000/v1";

async function httpGetPlanets() {
  // TODO: Once API is ready.
  // Load planets and return as JSON.
  return fetch(`${API_URL}/planets`).then((res) => res.json());
  // .then((data) => console.log("fata", data));
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
  // Load launches, sort by flight number, and return as JSON.
  const response = await fetch(`${API_URL}/launches`);
  // Convert to JSON array
  const launches = await response.json();
  // Sort by flight number
  const sortedLaunches = launches.sort(
    (a, b) => a.flightNumber - b.flightNumber,
  );
  return sortedLaunches;
}

async function httpSubmitLaunch(launch) {
  console.log("launch in httpSubmitLaunch", launch);
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch (error) {
    return { ok: false };
  }
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
  try {
      return await fetch(`${API_URL}/launches/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.log(error);
    return { ok: false };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
