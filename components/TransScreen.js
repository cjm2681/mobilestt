import React, { useState, } from 'react';
import axios from 'axios';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranscript } from './TranscriptContext';
import { MaterialIcons } from '@expo/vector-icons';

function TransScreen({ navigation }) {
  const [transResult, setTransResult] = useState('')
  const [sourceLanguage, setSourceLanguage] = useState('ko')
  const [targetLanguage, setTargetLanguage] = useState('en')
  const [isLoading, setIsLoading] = useState(false);  //로딩

  const { transcript, transcriptionId } = useTranscript();


  const uploadTranslations = async (translationsText, transcriptionId) => {
    console.log("Uploading translations with transcriptionId:", transcriptionId);
    try {
      const response = await axios.post('http://220.94.222.233:4000/uploadTranslations', {
        translationsText,
        transcriptionId
      });

      console.log('서버 응답:', response.data);
    } catch (error) {
      console.error('업로드 중 오류 발생:', error);
      console.error('요청 데이터:', { translationsText, transcriptionId });
    }
  };




  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-NCP-APIGW-API-KEY-ID': 'fb6tfb4y6a',
      'X-NCP-APIGW-API-KEY': 'qDLBtofscKF7EweZuJXTsDMyCx3EQ7IWNTju7TCx',
    },
  }
  const handleTranslation = async () => {//papago 번역기능

    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation',
        {
          source: sourceLanguage,
          target: targetLanguage,
          text: transcript,
          //text: 'This is a Papago translator test.'
        },
        config
      );
      const translatedText = response.data.message.result.translatedText;
      setTransResult(translatedText);
      uploadTranslations(translatedText, transcriptionId);
    } catch (error) {
      console.error('Translation failed:', error);
    }
    setIsLoading(false);
  };


  const allTargetOptions = [
    { label: "한국어", value: "ko" },
    { label: "영어", value: "en" },
    { label: "일본어", value: "ja" },
    { label: "중국어 간체", value: "zh-CN" },
    { label: "중국어 번체", value: "zh-TW" },
    { label: "베트남어", value: "vi" },
    { label: "태국어", value: "th" },
    { label: "인도네시아어", value: "id" },
    { label: "프랑스어", value: "fr" },
    { label: "스페인어", value: "es" },
    { label: "러시아어", value: "ru" },
    { label: "독일어", value: "de" },
    { label: "이탈리아어", value: "it" },
  ]


  // 영어를 소스 언어로 선택했을 때의 타겟 언어 옵션
  const englishTargetOptions = [
    { label: "한국어", value: "ko" },
    { label: "일본어", value: "ja" },
    { label: "중국어 간체", value: "zh-CN" },
    { label: "중국어 번체", value: "zh-TW" },
    { label: "베트남어", value: "vi" },
    { label: "태국어", value: "th" },
    { label: "인도네시아어", value: "id" },
    { label: "프랑스어", value: "fr" },
  ];

  const japaneseTargetOptions = [
    { label: "한국어", value: "ko" },
    { label: "영어", value: "en" },
    { label: "중국어 간체", value: "zh-CN" },
    { label: "중국어 번체", value: "zh-TW" },
    { label: "베트남어", value: "vi" },
    { label: "태국어", value: "th" },
    { label: "인도네시아어", value: "id" },
    { label: "프랑스어", value: "fr" },
  ]



  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} >
      <Text style={styles.header}>번역할 원본 언어 선택</Text>
      <Picker
        selectedValue={sourceLanguage}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) =>
          setSourceLanguage(itemValue)
        }>
        <Picker.Item label="한국어" value="ko" />
        <Picker.Item label="영어" value="en" />
        <Picker.Item label="일본어" value="ja" />
        <Picker.Item label="중국어 간체" value="zh-CN" />
        <Picker.Item label="중국어 번채" value="zh-TW" />
        <Picker.Item label="베트남어" value="vi" />
        <Picker.Item label="인도에시아어" value="id" />
        <Picker.Item label="프랑스어" value="fr" />
        <Picker.Item label="스페인어" value="es" />
        <Picker.Item label="러시아어" value="ru" />
        <Picker.Item label="독일어" value="de" />
        <Picker.Item label="이탈리아어" value="it" />
      </Picker>


      <Text style={styles.subHeader}>번역 결과 언어를 선택해주세요</Text>
      <Picker
        selectedValue={targetLanguage}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) =>
          setTargetLanguage(itemValue)
        }>
        {sourceLanguage === 'en' ? (
          englishTargetOptions.map((option, index) => (
            <Picker.Item key={index} label={option.label} value={option.value} />
          ))
        ) :
          sourceLanguage === 'ja' ? (
            japaneseTargetOptions.map((option, index) => (
              <Picker.Item key={index} label={option.label} value={option.value} />
            ))
          ) : (
            allTargetOptions.map((option, index) => (
              <Picker.Item key={index} label={option.label} value={option.value} />
            ))
          )
        }
      </Picker>



      <View>
        <TouchableOpacity style={styles.button} onPress={handleTranslation}>
          <MaterialIcons name="translate" size={24} color="white" />
          <Text style={styles.buttonText}>번역하기</Text>
        </TouchableOpacity>
      </View>

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {!isLoading && transResult && <Text style={styles.resultText}>{transResult}</Text>}

    </ScrollView>
  )
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
  resultText: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 10,
    backgroundColor: 'white',
    width: '100%',
  },

});




export default TransScreen