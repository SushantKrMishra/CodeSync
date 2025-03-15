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
    default:
      throw new Error(`Invalid Connection status: ${data}`);
  }
}
