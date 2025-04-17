import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../../store/slices/authSlice';
import { TextInput, useTheme } from 'react-native-paper';

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const { colors } = useTheme();

  const handleSignup = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!role) {
      Alert.alert('Error', 'Please select a role');
      return;
    }

    try {
      await dispatch(signupUser({ 
        email, 
        password,
        role, 
        name
      }));
      setEmail('');
      setPassword('');
      setName('');
      setRole('student');
    
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primary }]}>Sign Up</Text>

      <TextInput
        style={styles.input}
        label="Full Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        activeOutlineColor={colors.primary}
      />
      <TextInput
        style={styles.input}
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
        activeOutlineColor={colors.primary}
      />
      <TextInput
        style={styles.input}
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        activeOutlineColor={colors.primary}
      />
      
      <Text style={styles.roleLabel}>Select your role:</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            { borderColor: colors.primary },
            role === 'teacher' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setRole('teacher')}
        >
          <Text style={[
            styles.roleButtonText,
            { color: colors.primary },
            role === 'teacher' && styles.roleButtonTextSelected
          ]}>Teacher</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.roleButton,
            { borderColor: colors.primary },
            role === 'student' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setRole('student')}
        >
          <Text style={[
            styles.roleButtonText,
            { color: colors.primary },
            role === 'student' && styles.roleButtonTextSelected
          ]}>Student</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate('Login')}
        style={styles.linkButton}
      >
        <Text style={[styles.linkText, { color: colors.primary }]}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  roleLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  roleButtonTextSelected: {
    color: 'white',
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
  },
});

export default Signup; 