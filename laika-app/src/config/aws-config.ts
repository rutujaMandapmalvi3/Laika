// src/config/aws-config.ts
export const awsConfig = {
  region: "us-west-2",
  userPoolId: "us-west-2_FQ07s4DBb",
  userPoolWebClientId: "79o2tl5to92c4or7lo130vt4ka",

  // DynamoDB configuration
  dynamodb: {
    region: "us-west-2",
    tables: {
      users: "Laika-Users",
      pets: "Laika-Pets",
      appointments: "Laika-Appointments",
      medicalRecords: "Laika-MedicalRecords",
      messages: "Laika-Messages",
      shelters: "Laika-Shelters",
      vets: "Laika-Vets",
    },
  },
};
