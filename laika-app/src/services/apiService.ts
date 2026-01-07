// src/services/apiService.ts
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { awsConfig } from "../config/aws-config";

const API_ENDPOINT = "https://3btiok3m76.execute-api.us-west-2.amazonaws.com";

const userPool = new CognitoUserPool({
  UserPoolId: awsConfig.userPoolId,
  ClientId: awsConfig.userPoolWebClientId,
});

// Helper to get current user's JWT token
const getAuthToken = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      reject(new Error("No user logged in"));
      return;
    }

    cognitoUser.getSession((err: any, session: any) => {
      if (err) {
        reject(err);
        return;
      }

      if (!session.isValid()) {
        reject(new Error("Session expired"));
      }

      resolve(session.getIdToken().getJwtToken());
    });
  });
};

// Helper for making authenticated API calls
const apiCall = async (
  endpoint: string,
  method: string = "GET",
  body?: any
) => {
  const token = await getAuthToken();

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_ENDPOINT}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API request failed");
  }

  return response.json();
};

// ============ USER PROFILE OPERATIONS ============

export const getUserProfile = async () => {
  return apiCall("/users/profile", "GET");
};

export const createUserProfile = async (userData: any) => {
  return apiCall("/users/profile", "POST", userData);
};

export const updateUserProfile = async (updates: any) => {
  return apiCall("/users/profile", "PUT", updates);
};

// ============ VET PROFILE OPERATIONS ============

export const getVetProfile = async (userId: string) => {
  return apiCall(`/users/vet/${userId}`, "GET");
};

export const createVetProfile = async (vetData: any) => {
  return apiCall("/users/vet", "POST", vetData);
};

// ============ SHELTER PROFILE OPERATIONS ============

export const getShelterProfile = async (userId: string) => {
  return apiCall(`/users/shelter/${userId}`, "GET");
};

export const createShelterProfile = async (shelterData: any) => {
  return apiCall("/users/shelter", "POST", shelterData);
};
