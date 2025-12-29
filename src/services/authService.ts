// src/services/authService.ts
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import { awsConfig } from "../config/aws-config";
import { UserRole } from "../types";

const userPool = new CognitoUserPool({
  UserPoolId: awsConfig.userPoolId,
  ClientId: awsConfig.userPoolWebClientId,
});

export interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  username: string;
  role: UserRole;
}

export interface SignInParams {
  username: string;
  password: string;
}

// Sign Up
export const signUp = (params: SignUpParams): Promise<any> => {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({ Name: "email", Value: params.email }),
      new CognitoUserAttribute({ Name: "given_name", Value: params.firstName }),
      new CognitoUserAttribute({ Name: "family_name", Value: params.lastName }),
      new CognitoUserAttribute({
        Name: "name",
        Value: `${params.firstName} ${params.lastName}`,
      }),
      new CognitoUserAttribute({
        Name: "phone_number",
        Value: params.phoneNumber,
      }),
      new CognitoUserAttribute({
        Name: "preferred_username",
        Value: params.username,
      }),
    ];

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

// Sign In
export const signIn = (params: SignInParams): Promise<any> => {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: params.username,
      Password: params.password,
    });

    const cognitoUser = new CognitoUser({
      Username: params.username,
      Pool: userPool,
    });

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

// Sign Out
export const signOut = (): Promise<void> => {
  return new Promise((resolve) => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    resolve();
  });
};

// Get Current User
export const getCurrentUser = (): Promise<any> => {
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

        const userData: any = {};
        attributes?.forEach((attribute) => {
          userData[attribute.Name] = attribute.Value;
        });

        resolve({
          ...userData,
          username: cognitoUser.getUsername(),
        });
      });
    });
  });
};

// Verify Email Code
export const confirmSignUp = (username: string, code: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

// Resend Verification Code
export const resendConfirmationCode = (username: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};
