// Replace the require with a dynamic import to support ESM in Netlify functions
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
  
  exports.handler = async function (event, context) {
    try {
      const { entryText } = JSON.parse(event.body);
      const apiKey = process.env.OPENAI_API_KEY;
  
      if (!apiKey) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'OpenAI API key not configured' }),
        };
      }
  
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a supportive and uplifting AI journal companion.' },
            { role: 'user', content: entryText },
          ],
          max_tokens: 150,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('OpenAI API error:', data);
        return {
          statusCode: response.status,
          body: JSON.stringify({ error: data.error.message || 'OpenAI API error' }),
        };
      }
  
      const message = data.choices?.[0]?.message?.content || 'No response generated.';
  
      return {
        statusCode: 200,
        body: JSON.stringify({ message }),
      };
    } catch (error) {
      console.error('Function error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server error: Failed to process request.' }),
      };
    }
  };
  