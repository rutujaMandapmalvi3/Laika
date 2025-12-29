// src/types/index.ts
export enum UserRole {
  OWNER = 'owner',
  VET = 'vet',
  SHELTER = 'shelter'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profilePicture?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VetProfile extends User {
  role: UserRole.VET;
  licenseNumber: string;
  specialization: string[];
  yearsOfExperience: number;
  clinicName?: string;
  clinicAddress?: string;
  rating: number;
  reviewCount: number;
}

export interface ShelterProfile extends User {
  role: UserRole.SHELTER;
  shelterName: string;
  address: string;
  capacity: number;
  currentOccupancy: number;
  registrationNumber: string;
  website?: string;
}

export interface OwnerProfile extends User {
  role: UserRole.OWNER;
  address?: string;
  pets: Pet[];
}

export interface Pet {
  id: string;
  ownerId: string;
  shelterId?: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed?: string;
  age?: number;
  weight?: number;
  gender?: 'male' | 'female';
  color?: string;
  photos: string[];
  microchipId?: string;
  isAdopted: boolean;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  petId: string;
  vetId: string;
  vetName: string;
  date: string;
  diagnosis: string;
  treatment: string;
  prescription?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  petId: string;
  ownerId: string;
  vetId: string;
  scheduledAt: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  type: 'video' | 'in-person' | 'chat';
  reason: string;
  notes?: string;
  createdAt: string;
}
