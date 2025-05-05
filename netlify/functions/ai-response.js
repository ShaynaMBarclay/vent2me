exports.handler = async (event) => {
    try {
      const { entryText } = JSON.parse(event.body);
  
      // Placeholder response – replace with real AI integration
      const message = `I'm glad you shared: "${entryText}". Keep going, you're doing great!`;
  
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      };
    } catch (error) {
      console.error('Function error:', error);
  
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Server error: unable to process entry.' }),
      };
    }
  };
  