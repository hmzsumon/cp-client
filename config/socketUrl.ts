// config/socketUrl.ts
let socketUrl = "";

if (process.env.NODE_ENV === "development") {
  socketUrl = "http://localhost:8000"; // local socket server
} else {
  socketUrl = "https://cgfx-api-571c8ffe2dd2.herokuapp.com"; // deployed socket server
}

export default socketUrl;
