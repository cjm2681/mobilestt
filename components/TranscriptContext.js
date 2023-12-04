import React, { createContext, useState, useContext } from 'react';

// Context 생성
const TranscriptContext = createContext();

export const TranscriptProvider = ({ children }) => {
  const [transcript, setTranscript] = useState('');
  const [transcriptionId, setTranscriptionId] = useState(null);

  return (
    <TranscriptContext.Provider value={{ transcript, setTranscript, transcriptionId, setTranscriptionId }}>
      {children}
    </TranscriptContext.Provider>
  );
};

export const useTranscript = () => {
  return useContext(TranscriptContext);
};
