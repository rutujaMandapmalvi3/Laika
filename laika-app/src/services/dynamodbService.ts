// src/services/dynamodbService.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { awsConfig } from "../config/aws-config";

// Create DynamoDB client
const client = new DynamoDBClient({ region: awsConfig.dynamodb.region });
const docClient = DynamoDBDocumentClient.from(client);

// ============ USERS TABLE ============

export const getUserProfile = async (userId: string) => {
  const command = new GetCommand({
    TableName: awsConfig.dynamodb.tables.users,
    Key: { userId },
  });

  const response = await docClient.send(command);
  return response.Item;
};

export const createUserProfile = async (userData: any) => {
  const command = new PutCommand({
    TableName: awsConfig.dynamodb.tables.users,
    Item: {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    },
  });

  await docClient.send(command);
  return userData;
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  Object.keys(updates).forEach((key, index) => {
    updateExpressions.push(`#field${index} = :value${index}`);
    expressionAttributeNames[`#field${index}`] = key;
    expressionAttributeValues[`:value${index}`] = updates[key];
  });

  // Always update the updatedAt timestamp
  updateExpressions.push(`#updatedAt = :updatedAt`);
  expressionAttributeNames["#updatedAt"] = "updatedAt";
  expressionAttributeValues[":updatedAt"] = new Date().toISOString();

  const command = new UpdateCommand({
    TableName: awsConfig.dynamodb.tables.users,
    Key: { userId },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  });

  const response = await docClient.send(command);
  return response.Attributes;
};

// ============ VETS TABLE ============

export const getVetProfile = async (userId: string) => {
  const command = new QueryCommand({
    TableName: awsConfig.dynamodb.tables.vets,
    IndexName: "UserIndex",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  });

  const response = await docClient.send(command);
  return response.Items?.[0];
};

export const createVetProfile = async (vetData: any) => {
  const command = new PutCommand({
    TableName: awsConfig.dynamodb.tables.vets,
    Item: {
      ...vetData,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });

  await docClient.send(command);
  return vetData;
};

// ============ SHELTERS TABLE ============

export const getShelterProfile = async (userId: string) => {
  const command = new QueryCommand({
    TableName: awsConfig.dynamodb.tables.shelters,
    IndexName: "UserIndex",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  });

  const response = await docClient.send(command);
  return response.Items?.[0];
};

export const createShelterProfile = async (shelterData: any) => {
  const command = new PutCommand({
    TableName: awsConfig.dynamodb.tables.shelters,
    Item: {
      ...shelterData,
      rating: 0,
      reviewCount: 0,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });

  await docClient.send(command);
  return shelterData;
};

// ============ PETS TABLE ============

export const getPetsByOwner = async (ownerId: string) => {
  const command = new QueryCommand({
    TableName: awsConfig.dynamodb.tables.pets,
    IndexName: "OwnerIndex",
    KeyConditionExpression: "ownerId = :ownerId",
    ExpressionAttributeValues: {
      ":ownerId": ownerId,
    },
  });

  const response = await docClient.send(command);
  return response.Items || [];
};

export const createPet = async (petData: any) => {
  const command = new PutCommand({
    TableName: awsConfig.dynamodb.tables.pets,
    Item: {
      ...petData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });

  await docClient.send(command);
  return petData;
};
