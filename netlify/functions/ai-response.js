const fetch = require('node-fetch'); 

exports.handler = async function(event, context) {
  const { entryText } = JSON.parse(event.body);  // Get the entryText from the frontend

  // Replace this with your OpenAI API key
  const apiKey = process.env.OPENAI_API_KEY;  

  const body = JSON.stringify({
    model: 'gpt-3.5-turbo',  
    messages: [{ role: 'user', content: entryText }],         
    max_tokens: 150,          
  });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: body,
    });

    const data = await response.json();

    // Return the response back to the frontend
    return {
      statusCode: 200,
      body: JSON.stringify({ message: data.choices[0].text }),
    };
  } catch (error) {
    console.error('Error fetching from OpenAI:', error);

    // Return error message if request fails
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch AI response' }),
    };
  }
};
