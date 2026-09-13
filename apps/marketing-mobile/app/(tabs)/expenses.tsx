import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ExpenseData {
  type: string;
  amount: string;
  description: string;
}

export default function ExpensesScreen() {
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const submitExpense = useMutation({
    mutationFn: async (data: ExpenseData) => {
      // Offline-first approach: Save to local storage for background sync
      const existingQueue = await AsyncStorage.getItem('offline_mutations');
      const queue = existingQueue ? JSON.parse(existingQueue) : [];
      queue.push({ type: 'ADD_EXPENSE', payload: data, timestamp: Date.now() });
      await AsyncStorage.setItem('offline_mutations', JSON.stringify(queue));
    },
    onSuccess: () => {
      setType('');
      setAmount('');
      setDescription('');
      alert('Expense recorded. Will sync when online.');
    }
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Log Expense</Text>
      
      <Input
        label="Expense Type (Fuel, Food, Travel)"
        value={type}
        onChangeText={setType}
        placeholder="e.g. Fuel"
      />
      <Input
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="0.00"
      />
      <Input
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Brief details..."
      />

      <Button
        title="Submit Expense"
        onPress={() => submitExpense.mutate({ type, amount, description })}
        style={styles.button}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0f172a',
  },
  button: {
    marginTop: 24,
  },
});
