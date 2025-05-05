const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const { entryText } = JSON.parse(event.body); // Assuming the user's entry text is sent in the body of the request
  
  const openaiApiKey = process.env.OPENAI_API_KEY; // Access the API key from the environment variable

  const prompt = `User's entry: "${entryText}". Provide a thoughtful, supportive, or funny response based on the content.`;

  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: 'text-davinci-003', // or another OpenAI model
      prompt: prompt,
      max_tokens: 150, // You can adjust the response length
      temperature: 0.7, // Adjust how creative the response is
    }),
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: data.choices[0].text.trim(),
    }),
  };
};
