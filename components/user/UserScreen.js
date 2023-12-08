import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTranscript } from '../TranscriptContext'
import axios from 'axios';

const UserScreen = ({ navigation }) => {
  const [user, setUser] = useState({
    id: '',
    password: '********', // 실제 애플리케이션에서는 비밀번호를 직접 노출하지 않습니다
    username: ''
  });


  const [transcriptions, setTranscriptions] = useState([]);

  const { setTranscript } = useTranscript();

  // 사용자 정보를 불러오는 함수
  const fetchUserInfo = () => {
    axios.get('http://localhost/userdata')
      .then(response => {
        setUser({
          id: response.data.id,
          username: response.data.username,
          password: '********' // 실제 애플리케이션에서는 비밀번호를 직접 노출하지 않습니다
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // 최근 변환 기록 3개 불러오기
    axios.get('http://localhost/allUserTranscriptions')
      .then(response => {
        setTranscriptions(response.data.slice(0, 3));
      })
      .catch(error => {
        console.error('Error fetching transcriptions:', error);
      });

  };

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo(); // 화면에 포커스가 맞춰질 때마다 사용자 데이터 다시 불러오기
    }, [])
  );


  useEffect(() => {
    // 사용자 정보를 불러오는 함수. 이 예시에서는 가상의 API 호출을 사용합니다.
    // 실제 애플리케이션에서는 이 부분을 서버로부터 사용자 데이터를 받아오는 로직으로 교체해야 합니다.
    axios.get('http://localhost/userdata')
      .then(response => {
        if (response.status === 200) {
          setUser({
            ...user,
            id: response.data.id,
            username: response.data.username
          });
        } else {
          Alert.alert("데이터 로드 실패", "사용자 정보를 불러오는데 실패했습니다.");
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);


  // 로그아웃 처리
  const handleLogout = () => {
    Alert.alert(
      "로그아웃 확인",
      "로그아웃 하시겠습니까?",
      [
        {
          text: "아니오",
          style: "cancel",
        },
        {
          text: "예",
          onPress: () => {
            axios.get('http://localhost/logout')
              .then((response) => {
                if (response.status === 200) {
                  setTranscript(''); // transcript 값을 초기화
                  navigation.navigate('Login'); // 로그인 화면으로 이동
                } else {
                  Alert.alert("로그아웃 실패", response.data); // 로그아웃 실패 메시지 표시
                }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          },
        },
      ],
      { cancelable: true }
    );
  }


  const changeScreen = () => (
    navigation.navigate('UserInfo')
  )

  const changetransScreen = () => (
    navigation.navigate('AllTrans')
  )



  return (


    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={styles.profileContainer}>
        <Text style={styles.name}>{user.username}</Text>
      </View>


      <View style={styles.infoContainer}>
        <View style={styles.infoGroup}>
          <Text style={styles.infoUserTilte}>회원정보</Text>
          <TouchableOpacity onPress={changeScreen}>
            <Text style={styles.modifyButtonText}>회원정보 수정</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoGroup2}>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>아이디:</Text>
            <Text style={styles.infoValue}>{user.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>비밀번호:</Text>
            <Text style={styles.infoValue}>********</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>닉네임:</Text>
            <Text style={styles.infoValue}>{user.username}</Text>
          </View>
        </View>



        <View style={styles.historyGroup}>
          <Text style={styles.infoUserTilte}>변환기록</Text>
          <TouchableOpacity onPress={changetransScreen}>
            <Text style={styles.modifyButtonText}>모든 변환기록 보기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          {transcriptions.map((transcript, index) => (
            <View key={index} style={styles.transcriptItem}>
              <View>
                <Text style={styles.transcriptText}>파일 이름: {transcript.audio_file_name}</Text>
                <Text style={styles.transcriptText}>변환 시간: {new Date(transcript.created_at).toLocaleString()}</Text>
                <Text style={styles.transcriptText}>텍스트 변환 내역:</Text>
                <Text style={styles.transcriptContent}>{transcript.transcription_text}</Text>
              </View>
            </View>
          ))}
        </View>

      </View>


      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="#FFFFFF" />
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>



    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: 'white',
  },
  name: {
    fontSize: 20,
    color: '#333333',
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 16,
  },
  infoGroup: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between', // 요소들을 양 끝으로 분산
    alignItems: 'center', // 수직 방향으로 중앙 정렬

  },
  infoGroup2: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  historyGroup: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between', // 요소들을 양 끝으로 분산
    alignItems: 'center', // 수직 방향으로 중앙 정렬

  },
  infoUserTilte: {
    backgroundColor: 'white',
  },
  infoValue: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoKey: {
    fontWeight: 'bold',
    marginRight: 8,
    // 나중에 추가할 스타일을 위한 공간입니다.
  },
  modifyButtonText: {
    color: '#5B36AC', // 버튼 텍스트 색상
    fontWeight: 'bold', // 버튼 텍스트를 굵게
  },
  logoutButton: {
    alignItems: 'center', // 아이콘과 텍스트를 수직 방향으로 중앙 정렬
    alignSelf: 'center', // 버튼을 가운데로 위치
    paddingHorizontal: 10, // 좌우 패딩
    paddingVertical: 10, // 상하 패딩
    borderRadius: 20, // 모서리 둥글게
    marginTop: 20, // 상단 여백
    backgroundColor: '#FE2E64', // 버튼 배경 색상
  },
  logoutText: {
    color: '#FFFFFF', // 텍스트 색상
    fontWeight: 'bold', // 텍스트 굵게
  },
  transcriptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  transcriptText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  transcriptContent: {
    fontSize: 14,
    marginBottom: 15,
  },
});

export default UserScreen;
