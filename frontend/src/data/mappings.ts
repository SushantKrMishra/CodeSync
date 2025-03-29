import { ConnectionStatus } from "../pages/UserDetails/hooks";

export function convertStringToConnectionStatus(
  data: string
): ConnectionStatus {
  switch (data) {
    case "none":
      return ConnectionStatus.None;
    case "pending":
      return ConnectionStatus.Pending;
    case "accepted":
      return ConnectionStatus.Accepted;
    case "rejected":
      return ConnectionStatus.Rejected;
    case "received":
      return ConnectionStatus.Recieved;
    default:
      throw new Error(`Invalid Connection status: ${data}`);
  }
}
