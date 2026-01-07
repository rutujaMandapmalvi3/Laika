# AWS Infrastructure Documentation - Laika Project

**Generated on:** 2026-01-06
**AWS Account ID:** 098459119693
**Region:** us-west-2 (US West - Oregon)

---

## Table of Contents
1. [AWS CLI Configuration](#aws-cli-configuration)
2. [IAM Identity](#iam-identity)
3. [DynamoDB Tables](#dynamodb-tables)
4. [Lambda Functions](#lambda-functions)
5. [API Gateway](#api-gateway)
6. [CloudFormation Stacks](#cloudformation-stacks)
7. [S3 Buckets](#s3-buckets)
8. [IAM Roles](#iam-roles)

---

## AWS CLI Configuration

### CLI Version
```
aws-cli/2.32.25 Python/3.13.11 Darwin/25.1.0 exe/arm64
```

### Configuration Settings
- **Profile:** default
- **Region:** us-west-2
- **Output Format:** json
- **Access Key:** ****************RY2Y (stored in shared-credentials-file)
- **Secret Key:** ****************OlVI (stored in shared-credentials-file)
- **Config File Location:** ~/.aws/config
- **Credentials File Location:** ~/.aws/credentials

---

## IAM Identity

### Current User
- **User Name:** laika
- **User ID:** AIDARN3E66BG2VTWXUR4G
- **Account:** 098459119693
- **ARN:** arn:aws:iam::098459119693:user/laika
- **Created:** 2025-12-30T02:03:24+00:00

---

## DynamoDB Tables

All tables are configured with:
- **Billing Mode:** PAY_PER_REQUEST (On-Demand)
- **Status:** ACTIVE
- **Current Item Count:** 0 (across all tables)

### 1. Laika-Users
**Primary Key:**
- Partition Key: `userId` (String)

**Attributes:**
- `userId` (S) - Partition Key
- `email` (S)

**Global Secondary Indexes:** None

**Purpose:** Stores user account information

---

### 2. Laika-Pets
**Primary Key:**
- Partition Key: `petId` (String)

**Attributes:**
- `petId` (S) - Partition Key
- `ownerId` (S)
- `shelterId` (S)
- `isAvailableForAdoption` (S)
- `createdAt` (S)

**Global Secondary Indexes:**
1. **ShelterIndex**
   - Partition Key: `shelterId`
   - Projection: ALL
   - Purpose: Query pets by shelter

2. **AdoptionStatusIndex**
   - Partition Key: `isAvailableForAdoption`
   - Sort Key: `createdAt`
   - Projection: ALL
   - Purpose: Query available pets for adoption, sorted by creation date

3. **OwnerIndex**
   - Partition Key: `ownerId`
   - Projection: ALL
   - Purpose: Query pets by owner

---

### 3. Laika-Shelters
**Primary Key:**
- Partition Key: `shelterId` (String)

**Attributes:**
- `shelterId` (S) - Partition Key
- `userId` (S)
- `city` (S)
- `state` (S)
- `hasAvailableCapacity` (S)

**Global Secondary Indexes:**
1. **UserIndex**
   - Partition Key: `userId`
   - Projection: ALL
   - Purpose: Query shelters by user

2. **CapacityIndex**
   - Partition Key: `hasAvailableCapacity`
   - Sort Key: `city`
   - Projection: ALL
   - Purpose: Find shelters with capacity in specific cities

3. **LocationIndex**
   - Partition Key: `city`
   - Sort Key: `state`
   - Projection: ALL
   - Purpose: Query shelters by location

---

### 4. Laika-Vets
**Primary Key:**
- Partition Key: `vetId` (String)

**Attributes:**
- `vetId` (S) - Partition Key
- `userId` (S)
- `city` (S)
- `state` (S)
- `isAcceptingNewPatients` (S)
- `primarySpecialization` (S)
- `rating` (N)

**Global Secondary Indexes:**
1. **UserIndex**
   - Partition Key: `userId`
   - Projection: ALL
   - Purpose: Query vets by user

2. **AvailabilityIndex**
   - Partition Key: `isAcceptingNewPatients`
   - Sort Key: `city`
   - Projection: ALL
   - Purpose: Find available vets in specific cities

3. **LocationIndex**
   - Partition Key: `city`
   - Sort Key: `state`
   - Projection: ALL
   - Purpose: Query vets by location

4. **SpecializationIndex**
   - Partition Key: `primarySpecialization`
   - Sort Key: `rating`
   - Projection: ALL
   - Purpose: Find vets by specialization, sorted by rating

---

### 5. Laika-Appointments
**Primary Key:**
- Partition Key: `appointmentId` (String)

**Attributes:**
- `appointmentId` (S) - Partition Key
- `vetId` (S)
- `petId` (S)
- `ownerId` (S)
- `scheduledAt` (S)

**Global Secondary Indexes:**
1. **VetIndex**
   - Partition Key: `vetId`
   - Sort Key: `scheduledAt`
   - Projection: ALL
   - Purpose: Query appointments by vet, sorted by time

2. **PetIndex**
   - Partition Key: `petId`
   - Sort Key: `scheduledAt`
   - Projection: ALL
   - Purpose: Query appointments by pet, sorted by time

3. **OwnerIndex**
   - Partition Key: `ownerId`
   - Sort Key: `scheduledAt`
   - Projection: ALL
   - Purpose: Query appointments by owner, sorted by time

---

### 6. Laika-Messages
**Primary Key:**
- Partition Key: `conversationId` (String)
- Sort Key: `timestamp` (String)

**Attributes:**
- `conversationId` (S) - Partition Key
- `timestamp` (S) - Sort Key
- `userId` (S)

**Global Secondary Indexes:**
1. **UserIndex**
   - Partition Key: `userId`
   - Sort Key: `timestamp`
   - Projection: ALL
   - Purpose: Query messages by user, sorted by time

---

### 7. Laika-MedicalRecords
**Primary Key:**
- Partition Key: `recordId` (String)

**Attributes:**
- `recordId` (S) - Partition Key
- `petId` (S)
- `createdAt` (S)

**Global Secondary Indexes:**
1. **PetIndex**
   - Partition Key: `petId`
   - Sort Key: `createdAt`
   - Projection: ALL
   - Purpose: Query medical records by pet, sorted by creation date

---

### 8. test-table
**Status:** Exists but not part of main infrastructure
**Purpose:** Test/development table

---

## Lambda Functions

### LaikaUsersFunction
**Full Name:** LaikaInfrastructureStack-LaikaUsersFunction7E065A5-mzhpmGD4LQ7e

**Configuration:**
- **Runtime:** nodejs18.x
- **Memory Size:** 128 MB
- **Timeout:** 30 seconds
- **Last Modified:** 2026-01-05T03:36:49.161+0000

**Environment Variables:**
- `USERS_TABLE`: Laika-Users
- `SHELTERS_TABLE`: Laika-Shelters
- `VETS_TABLE`: Laika-Vets

**IAM Role:** LaikaInfrastructureStack-LaikaUsersFunctionServiceR-BqwiHKWcxDSv

**Log Group:** /aws/lambda/LaikaInfrastructureStack-LaikaUsersFunction7E065A5-mzhpmGD4LQ7e

**Purpose:** Handles user-related API operations including profile management, shelter operations, and vet operations

---

## API Gateway

### Laika API (HTTP API)
**API ID:** 3btiok3m76
**Type:** AWS::ApiGatewayV2::Api
**Stage:** $default

**Authentication:**
- JWT Authorizer configured (ID: 5ytd1q)

**Endpoints:**

#### GET Endpoints
1. **GET /users/profile**
   - Route ID: g7hv1l7
   - Integration: LaikaUsersFunction
   - Purpose: Get user profile

2. **GET /users/shelter/{userId}**
   - Route ID: 8b7ujk5
   - Integration: LaikaUsersFunction
   - Purpose: Get shelter information by user ID

3. **GET /users/vet/{userId}**
   - Route ID: 5wr8oz4
   - Integration: LaikaUsersFunction
   - Purpose: Get vet information by user ID

#### POST Endpoints
1. **POST /users/profile**
   - Route ID: o9qwsnp
   - Integration: LaikaUsersFunction
   - Purpose: Create user profile

2. **POST /users/shelter**
   - Route ID: q68k43v
   - Integration: LaikaUsersFunction
   - Purpose: Create shelter profile

3. **POST /users/vet**
   - Route ID: g146p9g
   - Integration: LaikaUsersFunction
   - Purpose: Create vet profile

#### PUT Endpoints
1. **PUT /users/profile**
   - Route ID: 5knlceu
   - Integration: LaikaUsersFunction
   - Purpose: Update user profile

---

## CloudFormation Stacks

### 1. LaikaInfrastructureStack
- **Status:** UPDATE_COMPLETE
- **Created:** 2026-01-04T21:34:37.700000+00:00
- **Purpose:** Main infrastructure stack for Laika application

**Resources (30 total):**
- 7 DynamoDB Tables
- 1 Lambda Function
- 1 API Gateway HTTP API
- 1 API Gateway Stage
- 10 API Gateway Routes
- 10 Lambda Permissions
- 1 API Gateway Authorizer
- 1 IAM Role
- 1 IAM Policy
- 1 CloudWatch Log Group
- 1 CDK Metadata

### 2. CDKToolkit
- **Status:** CREATE_COMPLETE
- **Created:** 2025-12-30T02:08:53.869000+00:00
- **Purpose:** AWS CDK bootstrap stack

---

## S3 Buckets

### cdk-hnb659fds-assets-098459119693-us-west-2
- **Created:** 2025-12-29T18:09:19
- **Purpose:** CDK asset storage bucket for CloudFormation templates and Lambda deployment packages

---

## IAM Roles

### Application Roles

#### LaikaInfrastructureStack-LaikaUsersFunctionServiceR-BqwiHKWcxDSv
- **Type:** Lambda Execution Role
- **Attached Policy:** Laika-Laika-Xz4wgQRPXJ6H
- **Purpose:** Service role for LaikaUsersFunction Lambda
- **Permissions:**
  - DynamoDB access to Laika-Users, Laika-Shelters, and Laika-Vets tables
  - CloudWatch Logs write access
  - Basic Lambda execution permissions

---

## Architecture Overview

### Application Flow
1. **API Gateway** receives HTTP requests
2. **JWT Authorizer** validates authentication tokens
3. **API Gateway Routes** forward requests to Lambda integrations
4. **Lambda Function** (LaikaUsersFunction) processes requests
5. **DynamoDB Tables** store and retrieve data
6. **CloudWatch Logs** capture Lambda execution logs

### Data Model Relationships
- **Users** can be associated with **Shelters** (via userId in Shelters table)
- **Users** can be associated with **Vets** (via userId in Vets table)
- **Pets** belong to **Shelters** (via shelterId)
- **Pets** have **Owners** (via ownerId referencing Users)
- **Appointments** link **Owners**, **Pets**, and **Vets**
- **Medical Records** belong to **Pets**
- **Messages** are organized by **Conversations** and linked to **Users**

### Access Patterns
The GSIs enable efficient queries for:
- Finding all pets in a shelter
- Finding available pets for adoption
- Finding shelters/vets by location
- Finding vets by specialization and rating
- Retrieving appointments by vet, pet, or owner
- Getting medical history for a pet
- Retrieving messages by user or conversation

---

## Cost Optimization Notes

### Current Configuration
- **DynamoDB:** All tables use on-demand (PAY_PER_REQUEST) billing
- **Lambda:** Using minimum memory (128 MB) with 30-second timeout
- **API Gateway:** HTTP API (cheaper than REST API)

### Recommendations for Production
- Monitor DynamoDB usage patterns; consider provisioned capacity if traffic is predictable
- Review Lambda memory allocation based on actual execution metrics
- Implement CloudWatch alarms for cost anomalies
- Consider AWS Budgets for spend tracking

---

## Security Considerations

### Current Security Measures
- JWT-based authentication on API Gateway
- IAM roles with least-privilege access
- Encrypted credentials in AWS credentials file

### Recommendations
- Enable DynamoDB Point-in-Time Recovery for critical tables
- Implement AWS WAF rules on API Gateway
- Enable CloudTrail for audit logging
- Consider using AWS Secrets Manager for sensitive configuration
- Review and rotate IAM access keys regularly
- Enable MFA for AWS account root user

---

## Deployment Information

### Infrastructure as Code
- **Tool:** AWS CDK (Cloud Development Kit)
- **Stack Management:** CloudFormation
- **Bootstrap Stack:** CDKToolkit

### CDK Asset Management
- Lambda code and CloudFormation templates are stored in the CDK assets S3 bucket
- Assets are versioned and managed by CDK

---

## Additional Notes

1. The infrastructure is currently deployed in a single region (us-west-2)
2. All resources are prefixed with "Laika" for easy identification
3. No EC2 instances or RDS databases are currently in use
4. The test-table exists outside the main infrastructure stack
5. All DynamoDB tables currently have 0 items (new deployment)

---

**Document End**
