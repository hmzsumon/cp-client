// config/socketUrl.ts
let socketUrl = "";

if (process.env.NODE_ENV === "development") {
  socketUrl = "http://localhost:8000"; // local socket server
} else {
  socketUrl = "https://cpfx-api-01d22e6d8bdf.herokuapp.com"; // deployed socket server
}

export default socketUrl;
