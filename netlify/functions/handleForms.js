const { writeFile } = require('fs/promises');
const path = require('path');

exports.handler = async (event) => {
  try {
    console.log('Received event:', event);

    // Ensure the request is a POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    // Log the event body for debugging
    const formData = event.body;
    console.log('Form data:', formData);

    const { participantName, themeScore, htmlScore, designScore } = JSON.parse(formData);

    // Mock saving data
    const filePath = path.join('/tmp', `${participantName}.json`);
    await writeFile(filePath, JSON.stringify({ themeScore, htmlScore, designScore }));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Submission successful!' }),
    };
  } catch (error) {
    console.error('Error in handleForm:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Submission failed!', error: error.message }),
    };
  }
};

