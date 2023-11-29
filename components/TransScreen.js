import React, { useState,} from 'react';
import axios from 'axios';
import { View, Text, Button, ActivityIndicator} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranscript } from './TranscriptContext';

function TransScreen({ navigation }) {
  const [transResult, setTransResult] = useState('')
  const [sourceLanguage, setSourceLanguage] = useState('ko')
  const [targetLanguage, setTargetLanguage] = useState('en')
  const [isLoading, setIsLoading] = useState(false);  //로딩

  const { transcript } = useTranscript();

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
    { label: "태국어", value: "th"},
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
      { label: "태국어", value: "th"},
      { label: "인도네시아어", value: "id" },
      { label: "프랑스어", value: "fr" },
    ];

    const japaneseTargetOptions = [
      { label: "한국어", value: "ko" },
      { label: "영어", value: "en" },
      { label: "중국어 간체", value: "zh-CN" },
      { label: "중국어 번체", value: "zh-TW" },
      { label: "베트남어", value: "vi" },
      { label: "태국어", value: "th"},
      { label: "인도네시아어", value: "id" },
      { label: "프랑스어", value: "fr" },
    ]

    

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Picker
        selectedValue={sourceLanguage}
        style={{ height: 50, width: 200 }}
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

      <Picker
        selectedValue={targetLanguage}
        style={{ height: 50, width: 200 }}
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
      


      <View style={{ marginTop: 100 }}>
        <Button title="번역하기" onPress={handleTranslation} />
        </View>
        { isLoading ? (
             <ActivityIndicator size="large" color="#0000ff" />
        ) : (
            <Text>{transResult}</Text>
        )
    }
    </View>
  )
}

export default TransScreen