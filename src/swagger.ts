import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MyBooks API",
      version: "1.0.0",
      description: "REST API for book catalog application",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/swaggerdesc/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
