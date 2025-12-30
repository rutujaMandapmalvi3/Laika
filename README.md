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
   -  Email
   -  Username
   -  Phone number
4. Required attributes:
   - email, given_name, family_name, phone_number, preferred_username
5. Enable self-registration

## System architecture for database management with cognito and dynamoDB:

┌───────────────────────────────────────────────────────────┐
                    LAIKA AUTHENTICATION SYSTEM               
└───────────────────────────────────────────────────────────┘

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




┌───────────────────────────────────────────────────────────┐
                      ALL DYNAMODB TABLES                     
└───────────────────────────────────────────────────────────┘

1. Users         → Basic profile (all users)
2. Pets          → Pet profiles
3. Appointments  → Vet appointments
4. MedicalRecords→ Medical history
5. Messages      → Chat messages
6. Shelters      → Shelter info + location
7. Vets          → Vet clinic info + location

## 3. All Errors Faced & Solutions {#errors}

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
  new CognitoUserAttribute({ Name: 'email', Value: params.email }),
  new CognitoUserAttribute({ Name: 'preferred_username', Value: params.username }),
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
