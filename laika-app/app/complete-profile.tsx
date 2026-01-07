// app/complete-profile.tsx
import { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { colors, spacing, typography } from '../src/constants/theme';
import { createUserProfile, createVetProfile, createShelterProfile } from '../src/services/dynamodbService';
import { UserRole } from '../src/types';

export default function CompleteProfileScreen() {
  const router = useRouter();
  const { userId, email } = useSelector((state: any) => state.auth);
  
  // Get role from registration (stored temporarily)
  // For now, we'll ask the user to select again
  const [role, setRole] = useState<UserRole>(UserRole.OWNER);
  
  // Common fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  });

  // Vet-specific fields
  const [clinicName, setClinicName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specializations, setSpecializations] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');

  // Shelter-specific fields
  const [shelterName, setShelterName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // Validate common fields
    if (!firstName || !lastName || !address.city || !address.state) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Validate role-specific fields
    if (role === UserRole.VET) {
      if (!clinicName || !licenseNumber || !phoneNumber) {
        Alert.alert('Error', 'Please fill in all vet information');
        return;
      }
    }

    if (role === UserRole.SHELTER) {
      if (!shelterName || !capacity || !phoneNumber) {
        Alert.alert('Error', 'Please fill in all shelter information');
        return;
      }
    }

    setIsLoading(true);

    try {
      // 1. Create Users table entry
      const userData = {
        userId,
        email,
        role,
        firstName,
        lastName,
        phoneNumber: phoneNumber || undefined,
        address,
      };

      await createUserProfile(userData);
      console.log('✅ User profile created');

      // 2. Create role-specific entry
      if (role === UserRole.VET) {
        const vetData = {
          vetId: `vet-${Date.now()}`,
          userId,
          clinicName,
          doctorName: `Dr. ${firstName} ${lastName}`,
          licenseNumber,
          credentials: [],
          specializations: specializations ? specializations.split(',').map(s => s.trim()) : [],
          primarySpecialization: specializations.split(',')[0]?.trim() || 'general',
          yearsOfExperience: parseInt(yearsOfExperience) || 0,
          bio: '',
          phoneNumber,
          email,
          address,
          consultationTypes: ['in-person', 'video'],
          operatingHours: {
            monday: '9:00 AM - 5:00 PM',
            tuesday: '9:00 AM - 5:00 PM',
            wednesday: '9:00 AM - 5:00 PM',
            thursday: '9:00 AM - 5:00 PM',
            friday: '9:00 AM - 5:00 PM',
            saturday: 'Closed',
            sunday: 'Closed',
          },
          emergencyAvailable: false,
          languages: ['English'],
          acceptedInsurance: [],
          fees: {
            consultation: 100,
            emergency: 200,
            video: 75,
          },
          isAcceptingNewPatients: 'YES',
          photos: [],
          certifications: [],
        };

        await createVetProfile(vetData);
        console.log('✅ Vet profile created');

      } else if (role === UserRole.SHELTER) {
        const shelterData = {
          shelterId: `shelter-${Date.now()}`,
          userId,
          shelterName,
          description: '',
          phoneNumber,
          email,
          website: '',
          address,
          coordinates: undefined,
          capacity: parseInt(capacity),
          currentOccupancy: 0,
          hasAvailableCapacity: 'YES',
          animalTypes: ['dogs', 'cats'],
          services: ['adoption', 'rescue'],
          operatingHours: {
            monday: '10:00 AM - 6:00 PM',
            tuesday: '10:00 AM - 6:00 PM',
            wednesday: '10:00 AM - 6:00 PM',
            thursday: '10:00 AM - 6:00 PM',
            friday: '10:00 AM - 6:00 PM',
            saturday: '10:00 AM - 4:00 PM',
            sunday: 'Closed',
          },
          registrationNumber,
          photos: [],
          isAcceptingDonations: false,
          city: address.city,
          state: address.state,
        };

        await createShelterProfile(shelterData);
        console.log('✅ Shelter profile created');
      }

      Alert.alert('Success!', 'Profile created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to appropriate dashboard
            if (role === UserRole.VET) {
              router.replace('/vet/dashboard');
            } else if (role === UserRole.SHELTER) {
              router.replace('/shelter/dashboard');
            } else {
              router.replace('/owner/dashboard');
            }
          },
        },
      ]);

    } catch (error: any) {
      console.error(' Profile creation error:', error);
      Alert.alert('Error', error.message || 'Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Tell us about yourself</Text>
        </View>

        {/* Common Fields */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <TextInput
            label="First Name *"
            value={firstName}
            onChangeText={setFirstName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Last Name *"
            value={lastName}
            onChangeText={setLastName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Email *"
            value={email}
            editable={false}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label={role === UserRole.OWNER ? "Phone Number" : "Phone Number *"}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            mode="outlined"
            keyboardType="phone-pad"
            placeholder="+1234567890"
            style={styles.input}
          />
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          
          <TextInput
            label="Street"
            value={address.street}
            onChangeText={(text) => setAddress({ ...address, street: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="City *"
            value={address.city}
            onChangeText={(text) => setAddress({ ...address, city: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="State *"
            value={address.state}
            onChangeText={(text) => setAddress({ ...address, state: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Zip Code"
            value={address.zipCode}
            onChangeText={(text) => setAddress({ ...address, zipCode: text })}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {/* Vet-Specific Fields */}
        {role === UserRole.VET && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Veterinary Information</Text>
            
            <TextInput
              label="Clinic Name *"
              value={clinicName}
              onChangeText={setClinicName}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="License Number *"
              value={licenseNumber}
              onChangeText={setLicenseNumber}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Specializations (comma-separated)"
              value={specializations}
              onChangeText={setSpecializations}
              mode="outlined"
              placeholder="surgery, dentistry, orthopedics"
              style={styles.input}
            />

            <TextInput
              label="Years of Experience"
              value={yearsOfExperience}
              onChangeText={setYearsOfExperience}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        )}

        {/* Shelter-Specific Fields */}
        {role === UserRole.SHELTER && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shelter Information</Text>
            
            <TextInput
              label="Shelter Name *"
              value={shelterName}
              onChangeText={setShelterName}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Capacity (max animals) *"
              value={capacity}
              onChangeText={setCapacity}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              label="Registration Number"
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
              mode="outlined"
              style={styles.input}
            />
          </View>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          style={styles.submitButton}
        >
          {isLoading ? 'Creating Profile...' : 'Complete Profile'}
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.lg,
    borderRadius: 8,
  },
});
