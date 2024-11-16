const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const contentType = event.headers['content-type'] || event.headers['Content-Type'];

  if (contentType.includes('multipart/form-data')) {
    const busboy = new Busboy({
      headers: {
        'content-type': contentType,
      },
    });

    const result = {};
    const uploads = [];

    return new Promise((resolve, reject) => {
      const bodyBuffer = Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8');
      busboy.on('field', (fieldname, value) => {
        result[fieldname] = value;
      });

      busboy.on('file', (fieldname, file, filename) => {
        const uploadPath = path.join('/tmp', filename);
        uploads.push(uploadPath);

        const writeStream = fs.createWriteStream(uploadPath);
        file.pipe(writeStream);

        file.on('end', () => {
          console.log(`File [${fieldname}] received: ${filename}`);
        });
      });

      busboy.on('finish', () => {
        console.log('Form data:', result);
        console.log('Uploaded files:', uploads);
        resolve({
          statusCode: 200,
          body: JSON.stringify({
            message: 'Submission successful!',
            data: result,
            files: uploads,
          }),
        });
      });

      busboy.on('error', (err) => {
        console.error('Error in busboy:', err);
        reject({
          statusCode: 500,
          body: JSON.stringify({ message: 'File upload failed!', error: err.message }),
        });
      });

      busboy.end(bodyBuffer);
    });
  } else {
    try {
      const body = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64').toString('utf8')
        : event.body;

      const formData = JSON.parse(body);
      console.log('Received JSON data:', formData);

      const { participantName, themeScore, htmlScore, designScore } = formData;

      // Save data to /tmp or another storage location
      const filePath = path.join('/tmp', `${participantName}.json`);
      fs.writeFileSync(filePath, JSON.stringify({ themeScore, htmlScore, designScore }));

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Submission successful!' }),
      };
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Submission failed!', error: error.message }),
      };
    }
  }
};

