import React, { useState } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet } from 'react-native';

export default function CreateAccount() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [wantsNotif, setWantsNotif] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleSubmit = () => {
    // Add your fetch logic here
const handleSubmit = async () => {
  setError('');
  setSuccess('');
  try {
    const res = await fetch('http://165.227.213.87:8000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        wants_notif: wantsNotif,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.detail || 'Signup failed');
    } else {
      setSuccess(data.message || 'Signup successful!');
      // Optionally, navigate to login or another page here
    }
  } catch (err) {
    setError('Network error');
  }
};

    // Example: send username, password, wantsNotif to backend
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.switchContainer}>
        <Text>Wants Notifications</Text>
        <Switch
          value={wantsNotif}
          onValueChange={setWantsNotif}
        />
      </View>
      <Button title="Sign Up" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 16, borderRadius: 8 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, justifyContent: 'space-between' },
});