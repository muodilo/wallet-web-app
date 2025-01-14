// swagger.js
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
	definition: {
		openapi: "3.0.0", // OpenAPI version
		info: {
			title: "wallet web app", 
			version: "1.0.0", 
			description: "API documentation description",
		},
		servers: [
			{
				url: "https://wallet-web-app.onrender.com",
			},
		],
	},
	apis: ["./routes/*.js"], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
