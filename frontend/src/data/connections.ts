import { mapAndThrowError } from "../domain/utils";
import { HandleConnection } from "../pages/ConnectionsReqests/hooks";
import { ConnectionUser } from "../pages/ConnectionSuggestion/hooks";
import { apiClient } from "./apiClient";

export async function getConnections(): Promise<ConnectionUser[]> {
  try {
    const response = await apiClient.get("/connection");
    return response.data.data;
  } catch (err) {
    mapAndThrowError(err);
  }
}

export async function getConnectionSuggestions(): Promise<ConnectionUser[]> {
  try {
    const response = await apiClient.get("/connection/suggestions");
    return response.data.data;
  } catch (err) {
    mapAndThrowError(err);
  }
}

export async function sendConnectionRequest(userId: string): Promise<void> {
  try {
    await apiClient.post("/connection/request/" + userId);
  } catch (err) {
    mapAndThrowError(err);
  }
}

export async function getRecievedConnections(): Promise<ConnectionUser[]> {
  try {
    const response = await apiClient.get("/api/connectionRequest/recieved");
    return response.data.data;
  } catch (err) {
    mapAndThrowError(err);
  }
}

export async function getSendConnections(): Promise<ConnectionUser[]> {
  try {
    const response = await apiClient.get("api/connectionRequest/send");
    return response.data.data;
  } catch (err) {
    mapAndThrowError(err);
  }
}

export async function withdrawConnection(id: string): Promise<void> {
  try {
    await apiClient.post("/connection/withdraw/" + id);
  } catch (err) {
    mapAndThrowError(err);
  }
}

export async function handleConnection(
  request: HandleConnection
): Promise<void> {
  try {
    await apiClient.post(`/connection/review/${request.status}/` + request.id);
  } catch (err) {
    mapAndThrowError(err);
  }
}
