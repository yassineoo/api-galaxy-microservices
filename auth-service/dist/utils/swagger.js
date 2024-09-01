"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
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
exports.specs = (0, swagger_jsdoc_1.default)(options);
/*
const outputFile = './swagger_output.json';
const endpointsFiles = ['../routes/example.js'];*

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);
*/
