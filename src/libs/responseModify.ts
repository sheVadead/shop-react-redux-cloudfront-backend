export const formatJSONResponse = (response: any, statusCode = 200) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify(response.message || response),
  };
};
