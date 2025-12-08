import ngrok from '@ngrok/ngrok';

export async function setup(app) {
  // create session
  const session = await new ngrok.SessionBuilder()
    .authtokenFromEnv()
    .metadata("Online in One Line")
    .connect();
  // create listener
  const listener = await session
    .httpEndpoint()
    .requestHeader("X-Req-Yup", "true")
    .listen();
  // link listener to app
  const socket = await ngrok.listen(app, listener);
  console.log(`Ingress established at: ${listener.url()}`);
}