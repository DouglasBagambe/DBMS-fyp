const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fleet Management API",
      version: "1.0.0",
      description: "API documentation for the Fleet Management System",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? process.env.RENDER_URL || "https://dbms-o3mb.onrender.com/api"
            : `http://localhost:${process.env.PORT || 3001}`,
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
