import axios from 'axios';
import { Broker, Diamond, Transaction } from '../types';

const API_URL = 'http://localhost:3001';

// Broker API
export const getBrokers = async (): Promise<Broker[]> => {
  const response = await axios.get(`${API_URL}/brokers`);
  return response.data;
};

export const getBroker = async (id: number): Promise<Broker> => {
  const response = await axios.get(`${API_URL}/brokers/${id}`);
  return response.data;
};

export const createBroker = async (broker: Omit<Broker, 'id'>): Promise<Broker> => {
  const response = await axios.post(`${API_URL}/brokers`, broker);
  return response.data;
};

export const updateBroker = async (id: number, broker: Partial<Broker>): Promise<Broker> => {
  const response = await axios.patch(`${API_URL}/brokers/${id}`, broker);
  return response.data;
};

export const deleteBroker = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/brokers/${id}`);
};

// Diamond API
export const getDiamonds = async (): Promise<Diamond[]> => {
  const response = await axios.get(`${API_URL}/diamonds`);
  return response.data;
};

export const getDiamond = async (id: number): Promise<Diamond> => {
  const response = await axios.get(`${API_URL}/diamonds/${id}`);
  return response.data;
};

export const createDiamond = async (diamond: Omit<Diamond, 'id'>): Promise<Diamond> => {
  const response = await axios.post(`${API_URL}/diamonds`, diamond);
  return response.data;
};

export const updateDiamond = async (id: number, diamond: Partial<Diamond>): Promise<Diamond> => {
  const response = await axios.patch(`${API_URL}/diamonds/${id}`, diamond);
  return response.data;
};

export const deleteDiamond = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/diamonds/${id}`);
};

// Transaction API
export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await axios.get(`${API_URL}/transactions`);
  return response.data;
};

export const getTransaction = async (id: number): Promise<Transaction> => {
  const response = await axios.get(`${API_URL}/transactions/${id}`);
  return response.data;
};

export const createTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  const response = await axios.post(`${API_URL}/transactions`, transaction);
  return response.data;
};

export const updateTransaction = async (id: number, transaction: Partial<Transaction>): Promise<Transaction> => {
  const response = await axios.patch(`${API_URL}/transactions/${id}`, transaction);
  return response.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/transactions/${id}`);
}; 