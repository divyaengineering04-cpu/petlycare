import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet Care API',
      version: '1.0.0',
      description: 'Pet Care Backend API'
    },

    servers: [
      {
        url: 'http://localhost:5004'
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },

    security: [
      {
        bearerAuth: []
      }
    ]
  },

  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export const registerSwagger = (app) => {
  app.get('/api-docs/openapi.json', (req, res) => {
    res.json(swaggerSpec);
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerSpec;