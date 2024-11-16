const { writeFile } = require('fs/promises');
const path = require('path');

exports.handler = async (event) => {
  try {
    const formData = JSON.parse(event.body);

    // Save scores and uploaded photo (mock implementation)
    const { participantName, themeScore, htmlScore, designScore } = formData;

    // Save the data (in a real app, use a database)
    const filePath = path.join('/tmp', `${participantName}.json`);
    await writeFile(filePath, JSON.stringify({ themeScore, htmlScore, designScore }));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Submission successful!' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Submission failed!' })
    };
  }
};

