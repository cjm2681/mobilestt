import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, Button,ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranscript } from './TranscriptContext';


export default function SumScreen({ navigation }) {
  const [summary, setSummary] = useState('');
  const [sumSentiment, setSumSentiment] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('ko'); //번역 언어 선택
  const [selectedCount, setSelectedCount] = useState('3');  //요약 문장 개수
  const [highestSentiment, setHighestSentiment] = useState(''); // 가장 높은 감정
  const [highestSentimentPercentage, setHighestSentimentPercentage] = useState(''); // 가장 높은 감정의 백분율
  const [isLoading, setIsLoading] = useState(false);  //로딩


  const { transcript } = useTranscript();

  const handleSummary = async () => {
    setIsLoading(true);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-NCP-APIGW-API-KEY-ID': 'o1eguzqxqv',   // 본인의 키
        'X-NCP-APIGW-API-KEY': 'KjMHvp7ZDmLo81xNlM3SqVOQGZmjcqz7jss978PC',    // 본인의 키
      },
    };

    try {
      const response = await axios.post(
        'https://naveropenapi.apigw.ntruss.com/text-summary/v1/summarize',
        {
          document: {
            content: transcript,
            title: 'Summary',
          },
          option: {
            language: selectedLanguage,
            model: "general",
            summaryCount: selectedCount,
          },
        },
        config
      );
      setSummary(response.data.summary);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };


  useEffect(() => {
    if (summary) {
      onSubmit();
    }
  }, [summary]);

  const onSubmit = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-NCP-APIGW-API-KEY-ID': 'o1eguzqxqv',   // 본인의 키
        'X-NCP-APIGW-API-KEY': 'KjMHvp7ZDmLo81xNlM3SqVOQGZmjcqz7jss978PC',    // 본인의 키
      },
    };

    try {
      const response = await axios.post(
        "https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1/analyze",
        { 
          content: summary 
        },
        config
      );
      setSumSentiment(response.data.document.sentiment);
      
      // 가장 높은 감정 찾기
      const highestEmotion = Object.keys(response.data.document.confidence).reduce((a, b) => response.data.document.confidence[a] > response.data.document.confidence[b] ? a : b);
      setHighestSentiment(highestEmotion);
      
      // 가장 높은 감정의 백분율 찾기
      
      setHighestSentimentPercentage(response.data.document.confidence[highestEmotion].toFixed(1));
    } catch (error) {
      console.error(error);
      setSumSentiment("Error");
    }
  };

  return (
    <View style ={{ flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Picker
        selectedValue={selectedLanguage}
        style={{ height: 50, width: 200 }}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedLanguage(itemValue)
        }>
        <Picker.Item label="한국어" value="ko" />
        <Picker.Item label="일본어" value="ja" />
      </Picker>
      <Picker
        selectedValue={selectedCount}
        style={{ height: 50, width: 200 }}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedCount(itemValue)
        }>
        <Picker.Item label="3줄로 요약" value="3" />
        <Picker.Item label="4줄로 요약" value="4" />
        <Picker.Item label="5줄로 요약" value="5" />
        <Picker.Item label="6줄로 요약" value="6" />
        <Picker.Item label="7줄로 요약" value="7"/>
        <Picker.Item label="8줄로 요약" value="8"/>
        <Picker.Item label="9줄로 요약" value="9"/>
      </Picker>

      <Button title="요약 결과 보기" onPress={handleSummary} />
      { isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
      <View>
      <Text>{summary}</Text>

      {sumSentiment !== '' && (
        <View style = {{flexDirection: 'row', padding: 10 , justifyContent: 'flex-end', alignItems: 'center'}}>
          <Text>감정 분석 결과: </Text>
          <Text>{highestSentimentPercentage}% { highestSentiment === 'negative' ? ('부정'): (highestSentiment === 'positive') ? ('긍정'): '중립' }적인 글입니다.</Text>
          <Text></Text>
        </View>
      )}
      </View>
      )}
    </View>
  );
}
