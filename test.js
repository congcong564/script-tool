$httpClient.post({
  url: 'http://172.16.66.56:7332/testsg',
  body: JSON.stringify({
    url: $request.url,
    response: $response.body
  }),
  headers: { 'Content-Type': 'application/json' },
}, (error, response, data) => {
  if (error) {
    console.log("Failed to send data to server: " + error);
  } else {
    console.log("Data sent to server successfully.");
  }
});
$done({});
