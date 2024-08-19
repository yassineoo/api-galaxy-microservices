import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'My REST API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        JWT: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        JWT: [],
      },
    ],
  },
  apis: ['src/routes/*.ts'],
};

export const specs = swaggerJSDoc(options)

/*
const outputFile = './swagger_output.json';
const endpointsFiles = ['../routes/example.js'];*

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);
*/

