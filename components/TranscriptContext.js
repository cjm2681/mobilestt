// TranscriptContext.js
import React, { createContext, useState, useContext } from 'react';

// Context 생성
const TranscriptContext = createContext();

// Context를 제공하는 컴포넌트
export const TranscriptProvider = ({ children }) => {
  const [transcript, setTranscript] = useState('');

  return (
    <TranscriptContext.Provider value={{ transcript, setTranscript }}>
      {children}
    </TranscriptContext.Provider>
  );
};

// Context를 사용하기 쉽게 만드는 훅
export const useTranscript = () => {
  return useContext(TranscriptContext);
};
