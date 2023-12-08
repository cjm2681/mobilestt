import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranscript } from './TranscriptContext';
import { AntDesign } from '@expo/vector-icons';


function SumScreen({ navigation }) {
  const [summary, setSummary] = useState(''); // 요약된 텍스트 저장
  const [sumSentiment, setSumSentiment] = useState(''); // 요약된 텍스트의 감정 분석 결과 저장
  const [selectedLanguage, setSelectedLanguage] = useState('ko'); //번역 언어 선택
  const [selectedCount, setSelectedCount] = useState('3');  //요약 문장 개수
  const [highestSentiment, setHighestSentiment] = useState(''); // 가장 높은 감정
  const [highestSentimentPercentage, setHighestSentimentPercentage] = useState(''); // 가장 높은 감정의 백분율
  const [isLoading, setIsLoading] = useState(false);  //로딩

  // TranscriptContext에서 트랜스크립트 및 트랜스크립션 ID 가져오기
  const { transcript, transcriptionId } = useTranscript();


  // 요약된 텍스트를 서버에 업로드하는 함수
  const uploadSummary = async (summaryText, transcriptionId) => {
    console.log("Uploading summary with transcriptionId:", transcriptionId);
    try {
      const response = await axios.post('http://localhost/uploadSummary', {
        summaryText,
        transcriptionId
      });

      console.log('서버 응답:', response.data);
    } catch (error) {
      console.error('업로드 중 오류 발생:', error);
      console.error('요청 데이터:', { summaryText, transcriptionId });
    }
  };






// 텍스트 요약 처리 함수
  const handleSummary = async () => {
    setIsLoading(true);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-NCP-APIGW-API-KEY-ID': 'KEY-ID',   // 본인의 키
        'X-NCP-APIGW-API-KEY': 'KEY',    // 본인의 키
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
      uploadSummary(response.data.summary, transcriptionId);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  // 요약된 텍스트가 변경될 때마다 실행
  useEffect(() => {
    if (summary) {
      onSubmit();
    }
  }, [summary]);
  // 감정 분석 요청 함수
  const onSubmit = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-NCP-APIGW-API-KEY-ID': 'KEY-ID',   // 본인의 키
        'X-NCP-APIGW-API-KEY': 'KEY',    // 본인의 키
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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} >
      <Text style={styles.header}>요약할 언어 선택</Text>
      <Picker
        selectedValue={selectedLanguage}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedLanguage(itemValue)
        }>
        <Picker.Item label="한국어" value="ko" />
        <Picker.Item label="일본어" value="ja" />
      </Picker>

      <Text style={styles.subHeader}>요약할 문장 개수를 선택하세요</Text>
      <Picker
        selectedValue={selectedCount}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedCount(itemValue)
        }>
        <Picker.Item label="3줄로 요약" value="3" />
        <Picker.Item label="4줄로 요약" value="4" />
        <Picker.Item label="5줄로 요약" value="5" />
        <Picker.Item label="6줄로 요약" value="6" />
        <Picker.Item label="7줄로 요약" value="7" />
        <Picker.Item label="8줄로 요약" value="8" />
        <Picker.Item label="9줄로 요약" value="9" />
        <Picker.Item label="10줄로 요약" value="10" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleSummary}>
        <AntDesign name="filetext1" size={24} color="white" />
        <Text style={styles.buttonText}>요약 결과 보기</Text>
      </TouchableOpacity>

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

      {!isLoading && summary && (
        <View style={styles.resultContainer} >
          <Text style={styles.resultText} >{summary}</Text>

          {sumSentiment !== '' && (
            <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'flex-end', alignItems: 'center' }}>
              <Text>감정 분석 결과: </Text>
              <Text>{highestSentimentPercentage}% {highestSentiment === 'negative' ? ('부정') : (highestSentiment === 'positive') ? ('긍정') : '중립'}적인 글입니다.</Text>
              <Text></Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  contentContainer: {
    paddingBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  picker: {
    width: 200,
    height: 50,
    borderColor: '#dddddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#5B36AC',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resultContainer: {
    marginTop: 20,
    width: '100%',
  },
  resultText: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 10,
    backgroundColor: 'white',
  },
});


export default SumScreen