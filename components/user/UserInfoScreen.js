import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

function UserInfoScreen({ navigation }) {
    // 상태 변수들
    const [newId, setNewId] = useState(''); // 아이디 입력 상태 관리
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


    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                // 여기에서 뒤로가기 버튼을 눌렀을 때의 동작을 정의합니다.
                navigation.goBack(); // 이전 화면으로 이동
                return true; // 이벤트 버블링을 막기 위해 true를 반환
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [navigation])
    );



    // 회원가입 버튼 클릭 시 실행되는 함수
    const handleUpdate = () => {
        if (password !== confirmPassword) {
            Alert.alert('오류', '비밀번호와 비밀번호 확인이 일치하지 않습니다.'); // 비밀번호와 비밀번호 확인이 일치하지 않을 경우 알림창 표시
            return;
        }

        axios.put('http://localhost/userupdate', {
            newId,
            username,
            password,
        })
            .then((response) => {
                Alert.alert('성공', '유저 정보가 수정되었습니다.\n새로 로그인해주세요.', [
                    {
                        text: 'OK',
                        onPress: () => axios.get('http://localhost/logout')
                            .then((response) => {
                                if (response.status === 200) {
                                    navigation.navigate('Login'); // 로그인 화면으로 이동
                                }
                            })
                    },
                ]);
                // 버튼 클릭 후 입력 필드 초기화
                resetForm();
            })
            .catch((error) => {
                if (error.response) {
                    Alert.alert('오류', error.response.data); // 서버에서 에러 응답이 온 경우 알림창 표시
                }

            });
    };







    return (
        <View style={styles.container}>
            <Text style={styles.title}>회원 정보 수정</Text>
            <TextInput
                value={newId}
                onChangeText={setNewId}
                placeholder="새로운 아이디"
                style={styles.input}
            />
            <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="새로운 사용자 이름"
                style={styles.input}
            />
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="새로운 비밀번호"
                secureTextEntry
                style={styles.input}
            />
            <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="비밀번호 확인"
                secureTextEntry
                style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>정보 수정하기</Text>
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
        backgroundColor: '#F9F9F9', // 배경색 변경
    },
    title: {
        fontSize: 20,
        marginBottom: 15,
        fontWeight: 'bold',
        color: '#5B36AC', // 제목 색상 변경
    },
    input: {
        height: 40,
        width: '80%',
        borderColor: '#5B36AC', // 테두리 색상 변경
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 5,
        backgroundColor: 'white', // 입력 필드 배경색 변경
    },
    button: {
        backgroundColor: '#FE2E64', // 버튼 배경색 변경
        borderRadius: 20,
        padding: 10,
        marginTop: 10,
        width: '50%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white', // 버튼 텍스트 색상 변경
        fontWeight: 'bold',
    }
});



export default UserInfoScreen;