// getAvailablePort.js
import getPort from "get-port";

/**
 * Returns port 9900 if free, otherwise throws an error
 * @returns {Promise<number>}
 */
export async function getAvailablePort() {
  const desiredPort = 9900;
  const port = await getPort({ port: desiredPort });

  if (port !== desiredPort) {
    throw new Error(`Port ${desiredPort} is already in use.`);
  }

  console.log(`✅ Using fixed port: ${port}`);
  return port;
}
