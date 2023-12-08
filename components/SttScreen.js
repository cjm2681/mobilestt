import React, { useState, } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios'

import ClovaSpeechClient from './Clova/ClovaSpeechClient';

import { useTranscript } from './TranscriptContext';



function SttScreen({ navigation }) {
  const [audioFile, setAudioFile] = useState(null); // 선택된 오디오 파일 저장
  const [transcriptSave, setTranscriptSave] = useState(''); //텍스트 변환
  const [transcript2, setTranscript2] = useState('');   // 화자인식
  const [showTranscript, setShowTranscript] = useState(false); //화자인식버튼 가시성제어
  const [showTranscript2, setShowTranscript2] = useState(false); //화자인식 내용 가시성 제어
  const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 상태
  const [isLoading2, setIsLoading2] = useState(false); // 데이터 로딩 상태
  const [language, setLanguage] = useState('ko-KR'); // 선택된 언어

  const [fileName, setFileName] = useState(''); // 파일 이름을 위한 새로운 상태

  const { transcript, setTranscript, transcriptionId, setTranscriptionId } = useTranscript();  //Context

  // 검색 관련 상태 변수
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [regex, setRegex] = useState(null);

  // 검색 로직
  const handleSearch = () => {
    if (!searchText.trim()) {
      setSearchResults([]);
      setRegex(null);
      return;
    }
    const newRegex = new RegExp(`(${searchText})`, 'gi');
    setRegex(newRegex);
    const splitText = transcriptSave.split(newRegex);
    setSearchResults(splitText);
  };


  // 파일 선택 핸들러
  const handleFileChange = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      console.log(result.assets[0].uri); // 첫 번째 파일의 URI 출력
      console.log(result.assets[0].name); // 첫 번째 파일의 name 출력
      setAudioFile(result.assets[0].uri); // 첫 번째 파일의 URI를 상태로 설정
      setFileName(result.assets[0].name); // 파일 이름을 상태로 설정
      setShowTranscript(false); // 파일을 선택하면 텍스트 변환 버튼을 다시 숨깁니다.
      setShowTranscript2(false); // 파일을 선택하면 화자인식 버튼과 transcript2를 숨깁니다.

    }
  };




 // 오디오 파일을 서버에 업로드하고 트랜스크립션 ID 저장
  const uploadTranscription = async (audioFileName, transcriptionText) => {
    try {
      const response = await axios.post('http://localhost/uploadTranscription', {
        audioFileName,
        transcriptionText
      });

      if (response.data.transcriptionId) {
        setTranscriptionId(response.data.transcriptionId);
      }

      console.log('서버 응답:', response.data);
    } catch (error) {
      console.error('업로드 중 오류 발생:', error);
    }
  };



  // 텍스트 변환 처리 함수
  const handleTranscript = async () => {
    if (audioFile) {
      setIsLoading(true); // 데이터 로딩 시작

      const client = new ClovaSpeechClient();

      const res = await client.req_upload({ uri: audioFile, name: fileName, type: 'audio/*' }, 'sync', null, null, null, null, true, true, null, language);

      if (res && res.data) {
        const segments = res.data.segments;
        const text = segments.map((segment) => `${segment.speaker.name}: ${segment.text}`).join('\n');
        setTranscriptSave(res.data.text); //텍스트 변환
        setTranscript2(text);   // 화자인식
        setShowTranscript(true);  // 화자인식 버튼 보여주기
        setIsLoading(false); // 데이터 로딩 완료

        setTranscript(res.data.text); //TranscriptContext

        uploadTranscription(fileName, res.data.text);
      }
    }

  };

  const handleSpeakerRecognition = () => {
    setIsLoading2(true); // 데이터 로딩 시작
    setShowTranscript2(true); // "화자인식" 누를 때 transcript2 표시
    setIsLoading2(false); // 데이터 로딩 완료
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 25 }} >
      <TouchableOpacity style={styles.button} onPress={handleFileChange}>
        <MaterialIcons name="attach-file" size={24} color="white" />
        <Text style={styles.buttonText}>파일 선택</Text>
      </TouchableOpacity>

      {fileName && <Text style={styles.infoValue} >선택된 파일: {fileName}</Text>}


      <Text style={styles.pickerLabel}>변환할 언어를 선택해 주세요</Text>
      <Picker
        selectedValue={language}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) =>
          setLanguage(itemValue)
        }>
        <Picker.Item label="한국어 (ko-KR)" value="ko-KR" />
        <Picker.Item label="영어 (en-US)" value="en-US" />
        <Picker.Item label="영어 + 한국어 (enko)" value="enko" />
        <Picker.Item label="일본어 (ja)" value="ja" />
        <Picker.Item label="중국어 간체 (zh-cn)" value="zh-cn" />
        <Picker.Item label="중국어 번체 (zh-tw)" value="zh-tw" />
      </Picker>




      {audioFile && (
        <TouchableOpacity style={styles.transcriptButton} onPress={handleTranscript}>
          <MaterialIcons name="transform" size={24} color="white" />
          <Text style={styles.transcriptButtonText}>텍스트 변환</Text>
        </TouchableOpacity>
      )}


      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          onChangeText={setSearchText}
          value={searchText}
          placeholder="텍스트 내 검색"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View>



      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={{ flex: 2 }}>
          {showTranscript && (
            <Text style={styles.transcriptText}>
              {searchResults.length > 0 && regex ? (
                searchResults.map((part, index) =>
                  regex.test(part) ?
                    <Text key={index} style={styles.highlightedText}>{part}</Text> :
                    part
                )
              ) : (
                transcriptSave
              )}
            </Text>
          )}



        </View>
      )}
      {showTranscript && (
        <TouchableOpacity style={styles.transcriptButton} onPress={handleSpeakerRecognition}>
          <MaterialIcons name="record-voice-over" size={24} color="white" />
          <Text style={styles.transcriptButtonText}>화자인식</Text>
        </TouchableOpacity>
      )}

      {isLoading2 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={{ flex: 2 }}>
          {showTranscript2 && <Text style={styles.transcriptText} >{transcript2}</Text>}
        </View>
      )}


    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#5B36AC',
    marginVertical: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 16,
    color: '#333333',
    margin: 10,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: 200,
    alignSelf: 'center',
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  transcriptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#5B36AC',
    marginVertical: 10,
    alignSelf: 'center',
  },
  transcriptButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  transcriptText: {
    fontSize: 16,
    color: '#333333',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 20,
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


export default SttScreen;