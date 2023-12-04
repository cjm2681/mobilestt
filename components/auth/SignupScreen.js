import React, { useState,} from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

function SignupScreen({ navigation }) {
  // 상태 변수들
  const [id, setId] = useState(''); // 아이디 입력 상태 관리
  const [username, setUsername] = useState(''); // 사용자 이름 입력 상태 관리
  const [password, setPassword] = useState(''); // 비밀번호 입력 상태 관리
  const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인 입력 상태 관리

  // 입력 필드 초기화 함수
  const resetForm = () => {
    setId('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  }

  // 회원가입 버튼 클릭 시 실행되는 함수
  const handleSignup = () => {
    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호와 비밀번호 확인이 일치하지 않습니다.'); // 비밀번호와 비밀번호 확인이 일치하지 않을 경우 알림창 표시
      return;
    }

    axios.post('http://220.94.222.233:4000/register', {
      id,
      username,
      password,
      confirmPassword,
    })
      .then((response) => {
        Alert.alert('성공', '회원가입이 성공적으로 완료되었습니다.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }, // OK 버튼 클릭 시 로그인 화면으로 이동
        ]);
        resetForm();
      })
      .catch((error) => {
        if (error.response) {
          Alert.alert('오류', error.response.data); // 서버에서 에러 응답이 온 경우 알림창 표시
        } else {
          Alert.alert('오류', '회원가입 중 오류가 발생했습니다.'); // 그 외의 경우 일반 오류 알림창 표시
        }
      });
  };

  return (
    <View style={styles.container}>
    <Text style={styles.title}>회원가입</Text>
    
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
      <MaterialCommunityIcons name="account-outline" size={24} color="#ff8c00" />
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="사용자 이름"
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

    <View style={styles.inputContainer}>
      <MaterialCommunityIcons name="lock-check" size={24} color="#ff8c00" />
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="비밀번호 확인"
        secureTextEntry
        style={styles.input}
      />
    </View>

    <TouchableOpacity style={styles.button} onPress={handleSignup}>
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
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 32,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#000000',
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


export default SignupScreen;