// TradeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const TradeContext = createContext();

export const TradeProvider = ({ children }) => {
  const { user } = useAuth();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
    // ✅ FIXED qty initialization
    const qty = tradeData.qty !== undefined && tradeData.qty !== ''
      ? Number(tradeData.qty)
      : 0;

    // ✅ FIXED entry initialization
    const entry = tradeData.entry !== undefined && tradeData.entry !== ''
      ? Number(tradeData.entry)
      : 0;

    await addDoc(collection(db, "trades"), {
      ...tradeData,
      entry,
      qty,
      bookedQty: 0,
      remainingQty: qty,
      userId: user.uid,
      riskAmount: parseFloat(settings.rValue),
      createdAt: Timestamp.now()
    });
  };

  const updateTrade = async (id, data) => {
    const parsedData = { ...data };

    const numericFields = ['entry', 'qty', 'bookedQty', 'remainingQty', 'sl', 'cmp', 'exitPrice'];

    numericFields.forEach((field) => {
      if (parsedData[field] !== undefined && parsedData[field] !== null && parsedData[field] !== '') {
        const num = Number(parsedData[field]);
        parsedData[field] = isNaN(num) ? parsedData[field] : num;
      }
    });

    if (parsedData.bookings && Array.isArray(parsedData.bookings)) {
      parsedData.bookings = parsedData.bookings.map(b => ({
        qty: Number(b.qty),
        price: Number(b.price)
      }));
    }

    await updateDoc(doc(db, "trades", id), parsedData);
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