import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

function LoginScreen({ navigation }) {
  // 상태 변수들
  const [id, setId] = useState(''); // 아이디 입력 상태 관리
  const [password, setPassword] = useState(''); // 비밀번호 입력 상태 관리

  // 입력 필드 초기화 함수
  const resetForm = () => {
    setId('');
    setPassword('');
  }

  // 로그인 버튼 클릭 시 실행되는 함수
  const handleLogin = () => {
    if (!id || !password) {
      Alert.alert('오류', '아이디와 비밀번호를 입력해주세요.'); // 입력값이 없을 경우 알림창 표시
      return;
    }

    axios
      .post('http://localhost/login', {
        id,
        password,
      })
      .then((response) => {
        Alert.alert('성공', response.data); // 로그인 성공 시 알림창 표시
        navigation.navigate('MainHome');
        resetForm();
      })
      .catch((error) => {
        if (error.response) {
          Alert.alert('오류', error.response.data); // 서버에서 에러 응답이 온 경우 알림창 표시
        } else {
          Alert.alert('오류', '로그인 중 오류가 발생했습니다.'); // 그 외의 경우 일반 오류 알림창 표시
        }
      });
  };

  return (

    <View style={styles.container}>
    <Text style={styles.title}>음성기록 서비스</Text>
    
    <View style={styles.inputContainer}>
      <MaterialCommunityIcons name="account" size={24} color="#ff8c00" />
      <TextInput
        value={id}
        onChangeText={setId}
        placeholder="아이디"
        style={styles.input}
      />
    </View>

    <View style={styles.inputContainer}>
      <MaterialCommunityIcons name="lock" size={24} color="#ff8c00" />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="비밀번호"
        secureTextEntry
        style={styles.input}
      />
    </View>

    <TouchableOpacity style={styles.button} onPress={handleLogin}>
      <Text style={styles.buttonText}>로그인</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
      <Text style={styles.buttonText}>회원가입</Text>
    </TouchableOpacity>
  </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9F9F9',  // 크림색 계열의 배경
  },
  title: {
    fontSize: 32,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#000000',  // 주황색 글씨
  },
  buttonContainer: {
    width: '80%', // 전체 비율에 맞게 조정
  },
  button: {
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#ff8c00',
    borderWidth: 2,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
  },
  button: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#5B36AC',
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

});



export default LoginScreen;