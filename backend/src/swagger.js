// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Torre Engineering API',
      version: '1.0.0',
      description: 'Documentation for the Torre Challenge API',
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? 'https://torre-engineering-test-technician-1.onrender.com'
            : 'http://localhost:3001',
      },
    ],
  },
  apis: ['./routes/torreRoutes.js'], // path relativo ao arquivo de rotas
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
