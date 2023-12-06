// TranscriptDetailsScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler, TextInput, TouchableOpacity } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios'

const TranscriptDetailsScreen = ({ route, navigation }) => {

  const [transcriptionDetails, setTranscriptionDetails] = useState(null);

  const { transcriptionId } = route.params;   // route.params에서 transcriptionId를 추출


  //검색어 관련
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState({});
  const [regex, setRegex] = useState(null);

    // 화면 포커스 시 실행되는 효과
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // 여기에서 뒤로가기 버튼을 눌렀을 때의 동작을 정의
        navigation.goBack(); // 이전 화면으로 이동
        return true; // 이벤트 버블링을 막기 위해 true를 반환
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );


  // 검색 로직
  const handleSearch = () => {
    if (!searchText.trim()) {
      setSearchResults({});
      setRegex(null);
      return;
    }

    const newRegex = new RegExp(`(${searchText})`, 'gi'); // 검색어에 대한 정규식 생성
    setRegex(newRegex);

    const newSearchResults = {};
    if (transcriptionDetails.transcription_text) {
      newSearchResults.transcription_text = transcriptionDetails.transcription_text.split(newRegex);
    }
    if (transcriptionDetails.summary_text) {
      newSearchResults.summary_text = transcriptionDetails.summary_text.split(newRegex);
    }
    if (transcriptionDetails.translated_text) {
      newSearchResults.translated_text = transcriptionDetails.translated_text.split(newRegex);
    }

    setSearchResults(newSearchResults);
  };




  // 트랜스크립션 상세 정보 가져오기
  useEffect(() => {
    console.log("Transcription ID: ", transcriptionId);

    const fetchTranscriptionDetails = async () => {
      try {
        const response = await axios.get(`http://220.94.222.233:4000/transcriptionDetails/${transcriptionId}`);
        console.log("Response data: ", response.data);
        setTranscriptionDetails(response.data);
      } catch (error) {
        console.error('Error fetching transcription details:', error);
        // 에러 처리
      }
    };

    if (transcriptionId) {
      fetchTranscriptionDetails();
    }
  }, [transcriptionId]);

  return (
    <ScrollView style={styles.container}>
      {/* 검색 입력 필드 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          onChangeText={setSearchText}
          value={searchText}
          placeholder="텍스트 내 입력"
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View>



      <View style={styles.detailsContainer}>
        {transcriptionDetails ? (
          <>
            {renderTextSection('변환된 텍스트:', transcriptionDetails.transcription_text, searchResults.transcription_text, regex)}
            {renderTextSection('요약된 텍스트:', transcriptionDetails.summary_text, searchResults.summary_text, regex)}
            {renderTextSection('번역된 텍스트:', transcriptionDetails.translated_text, searchResults.translated_text, regex)}
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>

    </ScrollView>
  );
};

// 텍스트 섹션 렌더링을 위한 도우미 함수
const renderTextSection = (title, originalText, searchTexts, regex) => {
  return originalText ? (
    <>
      <Text style={styles.detailTitle}>{title}</Text>
      <Text style={styles.detailText}>
        {searchTexts ? searchTexts.map((part, index) =>
          regex && regex.test(part) ? <Text key={index} style={styles.highlightedText}>{part}</Text> : part
        ) : originalText}
      </Text>
    </>
  ) : null;
};






const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  detailsContainer: {
    padding: 10,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  searchButton: {
    padding: 10,
    backgroundColor: '#5B36AC',
    borderRadius: 5,
    marginLeft: 10,
  },
  searchButtonText: {
    color: 'white',
  },
  highlightedText: {
    backgroundColor: 'yellow',
  },
});






export default TranscriptDetailsScreen;
