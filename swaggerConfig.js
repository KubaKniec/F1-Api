import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'F1 API Documentation',
            version: '1.0.0',
            description: 'API documentation for the F1 application',
        },
        servers: [
            {
                url: 'http://localhost:8989',
                description: 'Development server',
            },
        ],
    },
    apis: ['./Routes/*.js'], // Include all route files
});