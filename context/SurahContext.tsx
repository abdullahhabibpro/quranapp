import { createContext, useContext, useState } from 'react';

const SurahContext = createContext<any>({});

export const SurahProvider = ({ children }: { children: React.ReactNode }) => {
  const [surah, setSurah] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [qari, setQari] = useState<string>('ar.alafasy');
  const [trans, setTrans] = useState<string>('en.sahih');

  return (
    <SurahContext.Provider value={{ surah, setSurah, type, setType, qari, setQari, trans, setTrans }}>
      {children}
    </SurahContext.Provider>
  );
};

export const useSurah = () => {
  const context = useContext(SurahContext);
  if (!context) {
    throw new Error('useSurah must be used within a SurahProvider');
  }
  return context;
};