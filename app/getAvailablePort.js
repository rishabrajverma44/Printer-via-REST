import getPort from "get-port";

export async function getAvailablePort() {
  const desiredPort = 9900;

  const port = await getPort({ port: desiredPort });

  if (port !== desiredPort) {
    console.warn(
      `Port ${desiredPort} is already in use. Switching to available port ${port}`
    );
  } else {
    console.log(`Using fixed port: ${port}`);
  }

  return port;
}
