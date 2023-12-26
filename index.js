const mysql = require('mysql');

const validateFields = (fields) => {
    const errors = {};

    // Validate fields for store.js
    if (!fields.state || fields.state.trim() === '') {
        errors.state = 'State is required.';
    }

    if (!fields.tigers || isNaN(fields.tigers)) {
        errors.tigers = 'Tigers must be a number.';
    }

    if (!fields.elephants || isNaN(fields.elephants)) {
        errors.elephants = 'Elephants must be a number.';
    }

    if (!fields.leopards || isNaN(fields.leopards)) {
        errors.leopards = 'Leopards must be a number.';
    }

    // Check if there are any errors
    const isValid = Object.keys(errors).length === 0;

    if (!isValid) {
        throw { errors, isValid };
    }

    // If no errors, return true to indicate successful validation
    return true;
};

exports.handler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);
        // Validate fields for store.js
        validateFields(requestBody);

        // Create a MySQL connection
        const connection = mysql.createConnection({
            host: 'googleforms.c6isbbs62jkt.us-east-1.rds.amazonaws.com',
            user: 'admin',
            password: 'password',
            database: 'animal',
        });

        // Connect to the database
        connection.connect();

        // Insert data into the "animal" table
        const insertQuery = `INSERT INTO animal (state, tigers, elephants, leopards) VALUES (?, ?, ?, ?)`;
        const insertValues = [requestBody.state, requestBody.tigers, requestBody.elephants, requestBody.leopards];

        connection.query(insertQuery, insertValues, (error, results) => {
            // Handle database query result
            if (error) {
                console.error('Error inserting data into the database:', error);
            } else {
                console.log('Data inserted successfully:', results);
            }

            // Close the database connection
            connection.end();
        });

        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST',
            },
            body: JSON.stringify({ message: 'Congratulations! Fields are valid. Data inserted into the database.' }),
        };
        return response;
    } catch (error) {
        const response = {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST',
            },
            body: JSON.stringify({ errors: error.errors, isValid: error.isValid }),
        };
        return response;
    }
};
