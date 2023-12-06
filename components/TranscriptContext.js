import React, { createContext, useState, useContext } from 'react';

// Context 객체를 생성합니다. 이 Context는 트랜스크립트와 트랜스크립션 ID에 관한 데이터를 전역적으로 공유할 수 있게 해줍니다.
const TranscriptContext = createContext();

export const TranscriptProvider = ({ children }) => {
  const [transcript, setTranscript] = useState('');
  const [transcriptionId, setTranscriptionId] = useState(null);
  // TranscriptContext.Provider를 사용하여 자식 컴포넌트에게 transcript와 transcriptionId를 전달합니다.
  return (
    <TranscriptContext.Provider value={{ transcript, setTranscript, transcriptionId, setTranscriptionId }}>
      {children}
    </TranscriptContext.Provider>
  );
};
// useTranscript 훅을 정의합니다. 이 훅은 TranscriptContext에서 데이터를 쉽게 가져올 수 있게 해줍니다.
export const useTranscript = () => {
  return useContext(TranscriptContext);
};
