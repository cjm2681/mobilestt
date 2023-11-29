import React, { useState, useEffect,useCallback  } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const UserScreen = ({ navigation }) => {
  const [user, setUser] = useState({
    id: '',
    password: '********', // 실제 애플리케이션에서는 비밀번호를 직접 노출하지 않습니다
    username: ''
  });


    // 사용자 정보를 불러오는 함수
    const fetchUserInfo = () => {
      axios.get('http://220.94.222.233:4000/userdata')
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
    };
  
    useFocusEffect(
      useCallback(() => {
        fetchUserInfo(); // 화면에 포커스가 맞춰질 때마다 사용자 데이터 다시 불러오기
      }, [])
    );


  useEffect(() => {
    // 사용자 정보를 불러오는 함수. 이 예시에서는 가상의 API 호출을 사용합니다.
    // 실제 애플리케이션에서는 이 부분을 서버로부터 사용자 데이터를 받아오는 로직으로 교체해야 합니다.
    axios.get('http://220.94.222.233:4000/userdata')
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
            text: "예",
            onPress: () => {
              axios.get('http://220.94.222.233:4000/logout')
                .then((response) => {
                  if (response.status === 200) {
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
          {
            text: "아니오",
            style: "cancel",
          },
        ]
      );
    }


const changeScreen = () => (
  navigation.navigate('UserInfo')
)

const changetransScreen = () => (
  navigation.navigate('AllTrans')
)



  return (


    <ScrollView style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>내정보 관리</Text>
      </View> */}
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

        <View style={styles.infoGroup2}>

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
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#5B36AC',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',

  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: 'white',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
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
  infoTitle: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  infoUserTitle: {
    // 회원정보 타이틀 스타일
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
});

export default UserScreen;
