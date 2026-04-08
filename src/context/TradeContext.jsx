import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const TradeContext = createContext();

export const TradeProvider = ({ children }) => {
  const { user } = useAuth();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // R-Value Settings Logic
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('journal_settings');
    return saved ? JSON.parse(saved) : { rValue: 1250 };
  });

  useEffect(() => {
    if (!user) {
      setTrades([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "trades"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tradesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrades(tradesData.sort((a, b) => b.date.seconds - a.date.seconds));
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addTrade = async (tradeData) => {
    await addDoc(collection(db, "trades"), {
      ...tradeData,
      userId: user.uid,
      riskAmount: parseFloat(settings.rValue), // Force parse
      createdAt: Timestamp.now()
    });
  };

  const updateTrade = async (id, data) => {
    await updateDoc(doc(db, "trades", id), data);
  };

  const deleteTrade = async (id) => {
    await deleteDoc(doc(db, "trades", id));
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('journal_settings', JSON.stringify(newSettings));
  };

  return (
    <TradeContext.Provider value={{ trades, loading, addTrade, updateTrade, deleteTrade, settings, updateSettings }}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrades = () => useContext(TradeContext);