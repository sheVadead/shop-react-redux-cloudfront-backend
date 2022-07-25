export const formatJSONResponse = (response: any, statusCode = 200) => {
  if (response.statusCode) {
    statusCode = response.statusCode;
  }
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify(response.message || response),
  };
};
