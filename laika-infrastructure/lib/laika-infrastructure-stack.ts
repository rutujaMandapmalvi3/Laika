import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigatewayv2";
import * as apigatewayIntegrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as apigatewayAuthorizers from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import * as cognito from "aws-cdk-lib/aws-cognito";

export class LaikaInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ============ DYNAMODB TABLES ============

    // 1. Users Table
    const usersTable = new dynamodb.Table(this, "LaikaUsersTable", {
      tableName: "Laika-Users",
      partitionKey: {
        name: "userId",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    usersTable.addGlobalSecondaryIndex({
      indexName: "EmailIndex",
      partitionKey: {
        name: "email",
        type: dynamodb.AttributeType.STRING,
      },
    });

    // 2. Pets Table
    const petsTable = new dynamodb.Table(this, "LaikaPetsTable", {
      tableName: "Laika-Pets",
      partitionKey: {
        name: "petId",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    petsTable.addGlobalSecondaryIndex({
      indexName: "OwnerIndex",
      partitionKey: {
        name: "ownerId",
        type: dynamodb.AttributeType.STRING,
      },
    });

    petsTable.addGlobalSecondaryIndex({
      indexName: "ShelterIndex",
      partitionKey: {
        name: "shelterId",
        type: dynamodb.AttributeType.STRING,
      },
    });

    petsTable.addGlobalSecondaryIndex({
      indexName: "AdoptionStatusIndex",
      partitionKey: {
        name: "isAvailableForAdoption",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "createdAt",
        type: dynamodb.AttributeType.STRING,
      },
    });

    // 3. Appointments Table
    const appointmentsTable = new dynamodb.Table(
      this,
      "LaikaAppointmentsTable",
      {
        tableName: "Laika-Appointments",
        partitionKey: {
          name: "appointmentId",
          type: dynamodb.AttributeType.STRING,
        },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.RETAIN,
        pointInTimeRecovery: true,
      }
    );

    appointmentsTable.addGlobalSecondaryIndex({
      indexName: "PetIndex",
      partitionKey: {
        name: "petId",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "scheduledAt",
        type: dynamodb.AttributeType.STRING,
      },
    });

    appointmentsTable.addGlobalSecondaryIndex({
      indexName: "VetIndex",
      partitionKey: {
        name: "vetId",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "scheduledAt",
        type: dynamodb.AttributeType.STRING,
      },
    });

    appointmentsTable.addGlobalSecondaryIndex({
      indexName: "OwnerIndex",
      partitionKey: {
        name: "ownerId",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "scheduledAt",
        type: dynamodb.AttributeType.STRING,
      },
    });

    // 4. Medical Records Table
    const medicalRecordsTable = new dynamodb.Table(
      this,
      "LaikaMedicalRecordsTable",
      {
        tableName: "Laika-MedicalRecords",
        partitionKey: {
          name: "recordId",
          type: dynamodb.AttributeType.STRING,
        },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.RETAIN,
        pointInTimeRecovery: true,
      }
    );

    medicalRecordsTable.addGlobalSecondaryIndex({
      indexName: "PetIndex",
      partitionKey: {
        name: "petId",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "createdAt",
        type: dynamodb.AttributeType.STRING,
      },
    });

    // 5. Messages Table
    const messagesTable = new dynamodb.Table(this, "LaikaMessagesTable", {
      tableName: "Laika-Messages",
      partitionKey: {
        name: "conversationId",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "timestamp",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    messagesTable.addGlobalSecondaryIndex({
      indexName: "UserIndex",
      partitionKey: {
        name: "userId",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "timestamp",
        type: dynamodb.AttributeType.STRING,
      },
    });

    // 6. Shelters Table
    const sheltersTable = new dynamodb.Table(this, "LaikaSheltersTable", {
      tableName: "Laika-Shelters",
      partitionKey: {
        name: "shelterId",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    sheltersTable.addGlobalSecondaryIndex({
      indexName: "LocationIndex",
      partitionKey: {
        name: "city",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "state",
        type: dynamodb.AttributeType.STRING,
      },
    });

    sheltersTable.addGlobalSecondaryIndex({
      indexName: "CapacityIndex",
      partitionKey: {
        name: "hasAvailableCapacity",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "city",
        type: dynamodb.AttributeType.STRING,
      },
    });

    sheltersTable.addGlobalSecondaryIndex({
      indexName: "UserIndex",
      partitionKey: {
        name: "userId",
        type: dynamodb.AttributeType.STRING,
      },
    });

    // 7. Vets Table
    const vetsTable = new dynamodb.Table(this, "LaikaVetsTable", {
      tableName: "Laika-Vets",
      partitionKey: {
        name: "vetId",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    vetsTable.addGlobalSecondaryIndex({
      indexName: "LocationIndex",
      partitionKey: {
        name: "city",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "state",
        type: dynamodb.AttributeType.STRING,
      },
    });

    vetsTable.addGlobalSecondaryIndex({
      indexName: "SpecializationIndex",
      partitionKey: {
        name: "primarySpecialization",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "rating",
        type: dynamodb.AttributeType.NUMBER,
      },
    });

    vetsTable.addGlobalSecondaryIndex({
      indexName: "AvailabilityIndex",
      partitionKey: {
        name: "isAcceptingNewPatients",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "city",
        type: dynamodb.AttributeType.STRING,
      },
    });

    vetsTable.addGlobalSecondaryIndex({
      indexName: "UserIndex",
      partitionKey: {
        name: "userId",
        type: dynamodb.AttributeType.STRING,
      },
    });

    // ============ LAMBDA FUNCTIONS ============

    // Users Lambda Function
    const usersLambda = new lambda.Function(this, "LaikaUsersFunction", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambda/users"),
      environment: {
        USERS_TABLE: usersTable.tableName,
        VETS_TABLE: vetsTable.tableName,
        SHELTERS_TABLE: sheltersTable.tableName,
      },
      timeout: cdk.Duration.seconds(30),
    });

    // Grant Lambda permissions to access DynamoDB
    usersTable.grantReadWriteData(usersLambda);
    vetsTable.grantReadWriteData(usersLambda);
    sheltersTable.grantReadWriteData(usersLambda);

    // ============ API GATEWAY ============

    const userPool = cognito.UserPool.fromUserPoolId(
      this,
      "LaikaUserPool",
      "us-west-2_FQ07s4DBb"
    );

    // Create HTTP API
    const httpApi = new apigateway.HttpApi(this, "LaikaApi", {
      apiName: "laika-api",
      description: "Laika Backend API",
      corsPreflight: {
        allowOrigins: ["*"],
        allowMethods: [
          apigateway.CorsHttpMethod.GET,
          apigateway.CorsHttpMethod.POST,
          apigateway.CorsHttpMethod.PUT,
          apigateway.CorsHttpMethod.DELETE,
          apigateway.CorsHttpMethod.OPTIONS,
        ],
        allowHeaders: ["Content-Type", "Authorization"],
      },
    });

    // Create JWT Authorizer
    const authorizer = new apigatewayAuthorizers.HttpJwtAuthorizer(
      "JwtAuthorizer",
      `https://cognito-idp.us-west-2.amazonaws.com/${userPool.userPoolId}`,
      {
        jwtAudience: ["79o2tl5to92c4or7lo130vt4ka"],
      }
    );

    // Create Lambda Integration
    const usersIntegration = new apigatewayIntegrations.HttpLambdaIntegration(
      "UsersIntegration",
      usersLambda
    );

    // Add routes
    httpApi.addRoutes({
      path: "/users/profile",
      methods: [
        apigateway.HttpMethod.GET,
        apigateway.HttpMethod.POST,
        apigateway.HttpMethod.PUT,
      ],
      integration: usersIntegration,
      authorizer,
    });

    httpApi.addRoutes({
      path: "/users/vet/{userId}",
      methods: [apigateway.HttpMethod.GET],
      integration: usersIntegration,
      authorizer,
    });

    httpApi.addRoutes({
      path: "/users/vet",
      methods: [apigateway.HttpMethod.POST],
      integration: usersIntegration,
      authorizer,
    });

    httpApi.addRoutes({
      path: "/users/shelter/{userId}",
      methods: [apigateway.HttpMethod.GET],
      integration: usersIntegration,
      authorizer,
    });

    httpApi.addRoutes({
      path: "/users/shelter",
      methods: [apigateway.HttpMethod.POST],
      integration: usersIntegration,
      authorizer,
    });

    // ============ OUTPUTS ============

    new cdk.CfnOutput(this, "ApiEndpoint", {
      value: httpApi.apiEndpoint,
      description: "API Gateway endpoint",
    });

    new cdk.CfnOutput(this, "UsersTableName", {
      value: usersTable.tableName,
      description: "Users table name",
    });

    new cdk.CfnOutput(this, "PetsTableName", {
      value: petsTable.tableName,
      description: "Pets table name",
    });

    new cdk.CfnOutput(this, "AppointmentsTableName", {
      value: appointmentsTable.tableName,
      description: "Appointments table name",
    });

    new cdk.CfnOutput(this, "MedicalRecordsTableName", {
      value: medicalRecordsTable.tableName,
      description: "Medical Records table name",
    });

    new cdk.CfnOutput(this, "MessagesTableName", {
      value: messagesTable.tableName,
      description: "Messages table name",
    });

    new cdk.CfnOutput(this, "SheltersTableName", {
      value: sheltersTable.tableName,
      description: "Shelters table name",
    });

    new cdk.CfnOutput(this, "VetsTableName", {
      value: vetsTable.tableName,
      description: "Vets table name",
    });
  }
}
