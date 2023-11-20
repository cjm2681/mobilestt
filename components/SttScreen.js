import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text, Platform, BackHandler, ToastAndroid, ScrollView, ActivityIndicator  } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';

import ClovaSpeechClient from './Clova/ClovaSpeechClient'; // ClovaSpeechClient 클래스를 임포트

import { useTranscript } from './TranscriptContext';



function SttScreen({ navigation }) {
  const [audioFile, setAudioFile] = useState(null);
  const [transcriptSave, setTranscriptSave] = useState(''); //텍스트 변환
  const [transcript2, setTranscript2] = useState('');   // 화자인식
  const [showTranscript, setShowTranscript] = useState(false); //화자인식버튼 가시성제어
  const [showTranscript2, setShowTranscript2] = useState(false); //화자인식 내용 가시성 제어
  const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 상태
  const [isLoading2, setIsLoading2] = useState(false); // 데이터 로딩 상태
  const [language, setLanguage] = useState('ko-KR'); // 선택된 언어

  const [fileName, setFileName] = useState(''); // 파일 이름을 위한 새로운 상태

  const doubleBackToExitPressedOnce = useRef(false); // 뒤로가기 버튼 두 번 클릭 시 종료 처리를 위한 Ref
  const { setTranscript } = useTranscript();

  // 뒤로가기 버튼 핸들링을 위한 이벤트 리스너 등록
  useEffect(() => {
    const handleBackPress = () => {
      if (doubleBackToExitPressedOnce.current) {
        BackHandler.exitApp(); // 앱 종료
        return true;
      }

      doubleBackToExitPressedOnce.current = true;
      setTimeout(() => {
        doubleBackToExitPressedOnce.current = false;
      }, 2000); // 2초 내에 다시 누르면 종료 안됨

      ToastAndroid.show('한 번 더 누르면 종료됩니다', ToastAndroid.SHORT); // ToastAndroid로 메시지 표시

      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress); // 뒤로가기 버튼 이벤트 리스너 등록

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress); // 컴포넌트가 언마운트될 때 이벤트 리스너 해제
    };
  }, []);

  // 안드로이드에서 뒤로가기 버튼 숨기기
  useEffect(() => {
    if (Platform.OS === 'android') {
      navigation.setOptions({
        headerLeft: null,
      });
    }
  }, [navigation]);




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
  


  const handleTranscript = async () => {
    if (audioFile) {
      setIsLoading(true); // 데이터 로딩 시작
      
      const client = new ClovaSpeechClient();

      // 파일 URI에서 파일 이름 추출

      //  const uriParts = audioFile.split('/');
      //  const fileName = uriParts[uriParts.length - 1]; // 배열의 마지막 요소가 파일 이름입니다.

      const res = await client.req_upload({ uri: audioFile, name: fileName, type: 'audio/*' }, 'sync', null, null, null, null, true, true, null, language);

      if (res && res.data) {
        const segments = res.data.segments;
        const text = segments.map((segment) => `${segment.speaker.name}: ${segment.text}`).join('\n');
        setTranscriptSave(res.data.text); //텍스트 변환
        setTranscript2(text);   // 화자인식
        setShowTranscript(true);  // 화자인식 버튼 보여주기
        setIsLoading(false); // 데이터 로딩 완료

        setTranscript(res.data.text);
      }
    }
    
  };
 
  const handleSpeakerRecognition = () => {
    setIsLoading2(true); // 데이터 로딩 시작
    setShowTranscript2(true); // "화자인식" 누를 때 transcript2 표시
    setIsLoading2(false); // 데이터 로딩 완료
  };

  return (
    <View style={{ flex: 1 }}>
      <Button title="파일 선택" onPress={handleFileChange} />
      
      {fileName && <Text>선택된 파일: {fileName}</Text>}

      <Picker
        selectedValue={language}
        style={{ height: 50, width: 200 }}
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




        {audioFile && <Button title="텍스트 변환" onPress={handleTranscript} />}
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
        <ScrollView style={{ flex: 2 }}>
        {showTranscript && <Text>{transcriptSave}</Text> }
        </ScrollView>
        )}
        {showTranscript && <Button title="화자인식" onPress={handleSpeakerRecognition} />}

        {isLoading2 ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
        <ScrollView style={{ flex: 2 }}>
                {showTranscript2 && <Text>{transcript2}</Text> }
        </ScrollView>
        )}

        
    </View>

  );
}


export default SttScreen;