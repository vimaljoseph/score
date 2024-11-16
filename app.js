document.getElementById('scoreForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  try {
    const response = await fetch('/.netlify/functions/handleForm', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    document.getElementById('responseMessage').textContent = result.message;
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('responseMessage').textContent = 'Submission failed! Please try again.';
  }
});

