# Laika Pet Care App - Essential Learning Notes 🐕

**Project:** Mobile app connecting pet owners, veterinarians, and animal shelters  
**Tech Stack:** React Native (Expo SDK 52), TypeScript, AWS Cognito, Redux Toolkit

**SetUp commands:**

- Create new Expo project with TypeScript
  npx create-expo-app@latest laika-app --template blank-typescript

- Navigate into project
  cd laika-app

- Create folder structure
  mkdir -p app/auth src/store/slices src/constants src/types src/services src/config

- Install Cognito authentication SDK
  npm install amazon-cognito-identity-js --legacy-peer-deps

- Clean install all dependencies
  rm -rf node_modules package-lock.json .expo && npm install --legacy-peer-deps

- Start Expo development server
  npx expo start --clear

- Press 'i' in terminal for iOS Simulator
- Press 'a' in terminal for Android Emulator

- DYNAMODB PART-

- cdk init app --language typescript
  Create CDK project with TypeScript

- npm install aws-cdk-lib
  Install AWS CDK library

- cdk bootstrap aws://098459119693/us-west-2
  Prepare AWS account for CDK (one-time setup)

- curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
  Download AWS CLI installer

- sudo installer -pkg AWSCLIV2.pkg -target /
  Install AWS CLI

- aws configure
  Configure AWS credentials

- cdk diff
  Preview what CDK will create/change

- cdk deploy
  Deploy infrastructure to AWS

- cdk destroy
  Delete all CDK resources from AWS

## 1. Project Architecture {#architecture}

### Folder Structure

```
laika-app/
├── app/                    # Expo Router screens (UI)
│   ├── _layout.tsx
│   ├── index.tsx
│   └── auth/
│       ├── login.tsx
│       └── register.tsx
├── src/                    # Business logic
│   ├── types/index.ts
│   ├── constants/theme.ts
│   ├── store/             # Redux
│   │   └── slices/
│   ├── services/          # API calls
│   │   └── authService.ts
│   └── config/
│       └── aws-config.ts
```

**Key Principle:** Separate UI (`app/`) from logic (`src/`)

### Authentication Architecture

```
┌─────────────┐
│   Cognito   │ ← Auth only (emails, passwords, tokens)
└──────┬──────┘
       │ Returns: userId: "abc-123"
       ↓
┌─────────────┐
│  DynamoDB   │ ← App data (pets, appointments, records)
└─────────────┘
```

**Cognito = Bouncer** (checks who you are)  
**DynamoDB = Storage** (holds your data)

## 2. AWS Cognito Setup {#cognito}

### Configuration Steps

1. AWS Console → Amazon Cognito → Create user pool
2. Choose: "Add sign-in and sign-up experiences"
3. Sign-in options:
   - Email
   - Username
   - Phone number
4. Required attributes:
   - email, given_name, family_name, phone_number, preferred_username
5. Enable self-registration

- We use Redux/Slice so that we dont have to track every screen's login state separately.
- With redux, any screen can access the login state.
- It is NOT for login access, but for storing the required logged-in user's data.(eg., authSlice = Your ID card; Other slices = Your full profile)
- Imagine Redux is a big storage box for the entire app. Slices are compartments inside that box.
  - Slices = Pieces of your app's global state

## System architecture for database management with cognito and dynamoDB:

# LAIKA AUTHENTICATION SYSTEM

                          ┌─────────────┐
                          │   COGNITO   │
                          │ (Auth Only) │
                          └──────┬──────┘
                                 │
                          Returns: userId
                                 │
                                 ▼
                          ┌─────────────┐
                          │USERS TABLE  │
                          │(All Users)  │
                          └──────┬──────┘
                                 │
                    Field: role = "vet" | "shelter" | "owner"
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
                 ▼               ▼               ▼
          ┌───────────┐   ┌───────────┐   ┌───────────┐
          │VETS TABLE │   │  SHELTERS │   │  (Owner:  │
          │           │   │   TABLE   │   │No Extra   │
          │(If Vet)   │   │           │   │  Table)   │
          │           │   │(If Shelter)│   │           │
          └───────────┘   └───────────┘   └───────────┘

[View the data file](/system-db.png)

## All DynamoDB Tables

1. Users → Basic profile (all users)
2. Pets → Pet profiles
3. Appointments → Vet appointments
4. MedicalRecords→ Medical history
5. Messages → Chat messages
6. Shelters → Shelter info + location
7. Vets → Vet clinic info + location

### What Each System Stores

### Cognito (Authentication)

- Email & password (hashed)
- Username
- Basic name & phone
- Login tokens
- Email verified status

**Purpose:** Handle login/signup, verify identity

---

### Users Table (Basic Profile)

- userId (from Cognito)
- Email
- Role (owner/vet/shelter)
- Name
- Phone (optional for owners)
- Profile photo URL
- Address
- Account status

**Purpose:** Store basic info for ALL users

---

### Vets Table (Vet-Specific)

- vetId
- userId (links to Users & Cognito)
- Clinic name
- License number
- Specializations
- Phone (REQUIRED)
- Address
- Operating hours
- Fees
- Rating

**Purpose:** Store veterinary business details

---

### Shelters Table (Shelter-Specific)

- shelterId
- userId (links to Users & Cognito)
- Shelter name
- Phone (REQUIRED)
- Address
- Capacity & occupancy
- Animal types accepted
- Operating hours
- Registration number
- Rating

**Purpose:** Store shelter facility details

---

### Other Tables

**Pets Table:** Pet profiles (name, species, owner, medical history)

**Appointments Table:** Vet appointments (date, time, pet, vet, status)

**MedicalRecords Table:** Medical history per pet (diagnoses, treatments, vaccinations)

**Messages Table:** Chat between users (owner↔vet, owner↔shelter)

---

### Why userId Links Everything?

- Cognito generates unique userId on signup
- All tables use this same userId
- One user = One userId across all systems
- Easy to fetch all data for a user

## DynamoDB:

- Create a dynamodbService.ts file to store all functions related to dynamodb in one place, it is easy to import and debug any functionalities regarding dynamodb.

## Table and types of primary keys used:
# DynamoDB Tables - Primary Keys

| Table Name      | Key Type     | Columns                                          |
|-----------------|--------------|--------------------------------------------------|
| Users           | HASH only    | userId (Partition Key)                           |
| Pets            | HASH only    | petId (Partition Key)                            |
| Appointments    | HASH only    | appointmentId (Partition Key)                    |
| MedicalRecords  | HASH only    | recordId (Partition Key)                         |
| Messages        | HASH + RANGE | conversationId (Partition) + timestamp (Sort Key)|
| Shelters        | HASH only    | shelterId (Partition Key)                        |
| Vets            | HASH only    | vetId (Partition Key)                            |


.
.
.
.
.
.
.
.
.
.
.
.
.
## 3. All Errors Faced & Solutions {#errors}

## Output endpoints after dynamodb deployment:

LaikaInfrastructureStack.ApiEndpoint = https://3btiok3m76.execute-api.us-west-2.amazonaws.com
LaikaInfrastructureStack.AppointmentsTableName = Laika-Appointments
LaikaInfrastructureStack.MedicalRecordsTableName = Laika-MedicalRecords
LaikaInfrastructureStack.MessagesTableName = Laika-Messages
LaikaInfrastructureStack.PetsTableName = Laika-Pets
LaikaInfrastructureStack.SheltersTableName = Laika-Shelters
LaikaInfrastructureStack.UsersTableName = Laika-Users
LaikaInfrastructureStack.VetsTableName = Laika-Vets

### Error 1: Cognito Registration - Invalid Parameter Exception

**Error Message:**

```
Registration Failed: Attributes did not conform to the schema:
aws:cognito:system.preferred_username: The attribute is required
```

**When:** Signing up new user

**Root Cause:** Not sending `preferred_username` as a Cognito attribute

**Solution:** Add to attribute list

```typescript
const attributeList = [
  new CognitoUserAttribute({ Name: "email", Value: params.email }),
  new CognitoUserAttribute({
    Name: "preferred_username",
    Value: params.username,
  }),
  // ... other attributes
];
```

**Lesson:** All required Cognito attributes must be explicitly set

### Error 2: Verification Email Never Arrives

**Error Message:** (No error, just missing email)

**When:** After successful registration

**Root Cause:** Cognito's default email service is unreliable

- Limited to 50 emails/day
- Often blocked by Gmail/Outlook
- Can take 10+ minutes or never arrive

**Solution for Testing:**

1. AWS Console → Cognito → Users
2. Select user → Actions → "Confirm account"

**Solution for Production:**

- Set up Amazon SES with verified domain
- Configure in Cognito → Messaging → Email

**Lesson:** Never rely on default Cognito email for production
