// src/services/authService.ts
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import { awsConfig } from "../config/aws-config";

const userPool = new CognitoUserPool({
  UserPoolId: awsConfig.userPoolId,
  ClientId: awsConfig.userPoolWebClientId,
});

interface SignUpParams {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface SignInParams {
  username: string;
  password: string;
}

export const signUp = async (params: SignUpParams) => {
  const attributeList = [
    new CognitoUserAttribute({ Name: "email", Value: params.email }),
    new CognitoUserAttribute({ Name: "given_name", Value: params.firstName }),
    new CognitoUserAttribute({ Name: "family_name", Value: params.lastName }),
    new CognitoUserAttribute({
      Name: "phone_number",
      Value: params.phoneNumber,
    }),
    new CognitoUserAttribute({
      Name: "preferred_username",
      Value: params.username,
    }),
  ];

  return new Promise((resolve, reject) => {
    userPool.signUp(
      params.username,
      params.password,
      attributeList,
      [],
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      }
    );
  });
};

export const confirmSignUp = async (username: string, code: string) => {
  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

export const resendConfirmationCode = async (username: string) => {
  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

export const signIn = async (params: SignInParams) => {
  const authenticationDetails = new AuthenticationDetails({
    Username: params.username,
    Password: params.password,
  });

  const cognitoUser = new CognitoUser({
    Username: params.username,
    Pool: userPool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve(result);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

export const signOut = async () => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
};

export const getCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      reject(new Error("No user found"));
      return;
    }

    cognitoUser.getSession((err: any, session: any) => {
      if (err) {
        reject(err);
        return;
      }

      cognitoUser.getUserAttributes((err, attributes) => {
        if (err) {
          reject(err);
          return;
        }

        const userData = attributes?.reduce((acc: any, attribute) => {
          acc[attribute.Name] = attribute.Value;
          return acc;
        }, {});

        resolve({
          ...userData,
          username: cognitoUser.getUsername(),
        });
      });
    });
  });
};
