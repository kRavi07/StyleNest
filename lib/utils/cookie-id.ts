import { v4 as uuidv4 } from "uuid";

export function getClientId() {
  let clientId = document.cookie
    .split("; ")
    .find((row) => row.startsWith("waitlistId="))
    ?.split("=")[1];

  if (!clientId) {
    clientId = uuidv4();
    document.cookie = `waitlistId=${clientId}; path=/; max-age=${
      60 * 60 * 24 * 365
    }`;
  }

  return clientId;
}
