exports.handler = async (event) => {
  try {
    const { text } = JSON.parse(event.body);
    const projectId = 'yourjournalai-9ndc';

    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, 'unique-session-id');

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text,
          languageCode: 'en-US',
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: result.fulfillmentText || 'No response from Dialogflow.' }),
    };

  } catch (error) {
    console.error('Dialogflow API call failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Oops! Couldn't get a response from Dialogflow." }),
    };
  }
};
