import swaggerJsdoc from "swagger-jsdoc"
import responses from "./responses"
import parameters from "./parameters"
import schemas from "./schemas"

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Loqui Express API with Swagger",
      version: "0.1.0",
      description:
          "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "GPL V3",
        url: "https://www.gnu.org/licenses/gpl-3.0.en.html",
      },
      contact: {
        name: "Mateo Lelong",
        email: "mateo.lelong@gmail.com",
      },
    },
    servers: [
      {
        url: process.env.FULL_NAME_WS,
      },
    ],
  },
  apis: ["src/routers/*.js"],
  components: {
    schemas,
    parameters,
    responses,
  },
};

export default swaggerJsdoc(options)
