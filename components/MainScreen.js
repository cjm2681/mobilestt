import React, { useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Alert, ToastAndroid, BackHandler } from 'react-native';
import SttScreen from './SttScreen';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import SumScreen from './SumScreen';
import TransScreen from './TransScreen';
import UserScreen from './user/UserScreen';
import { useTranscript } from './TranscriptContext';


const Tab = createBottomTabNavigator();


function MainScreen({ navigation }) {

  const doubleBackToExitPressedOnce = useRef(false); // 뒤로가기 버튼 두 번 클릭 시 종료 처리를 위한 Ref

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




  const { transcript } = useTranscript();   // 전역 상태에서 트랜스크립트 가져오기

    // 탭 버튼 클릭 핸들러
  const handleTabPress = (routeName) => {
        // 트랜스크립트가 없는 경우 경고 메시지를 표시하고 홈 화면으로 이동
    if (!transcript && (routeName === 'SummarySentiment' || routeName === 'Translator')) {
      Alert.alert(
        "텍스트 변환 필요",
        "텍스트 변환을 먼저 해주세요.",
        [{ text: "OK", onPress: () => navigation.navigate('Home') }]
      );
    } else {
      navigation.navigate(routeName);
    }
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#fb8c00',
        tabBarShowLabel: true,

      }}>
      <Tab.Screen
        name="Home"
        component={SttScreen}
        options={{
          title: '텍스트 요약',
          headerStyle: {
            backgroundColor: '#5B36AC', // 헤더의 배경색 설정
            height: 85,
          },
          headerTintColor: '#fff', // 헤더 타이틀의 색상 설정
          headerTitleStyle: {
            fontWeight: 'bold', // 헤더 타이틀의 폰트 스타일 설정
            height: 35,
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          )

        }}
      />
      <Tab.Screen
        name="SummarySentiment"
        component={SumScreen}
        options={{
          title: '요약 및 감정분석',
          headerStyle: {
            backgroundColor: '#5B36AC', // 헤더의 배경색 설정
            height: 85,
          },
          headerTintColor: '#fff', // 헤더 타이틀의 색상 설정
          headerTitleStyle: {
            fontWeight: 'bold', // 헤더 타이틀의 폰트 스타일 설정
            height: 35,
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="text-box-multiple" color={color} size={size} />
          )
        }}
        listeners={{
          tabPress: (e) => {
            // 기본 동작 방지
            e.preventDefault();
            handleTabPress('SummarySentiment');
          },
        }}
      />

      <Tab.Screen
        name="Translator"
        component={TransScreen}
        options={{
          title: '번역',
          headerStyle: {
            backgroundColor: '#5B36AC', // 헤더의 배경색 설정
            height: 85,
          },
          headerTintColor: '#fff', // 헤더 타이틀의 색상 설정
          headerTitleStyle: {
            fontWeight: 'bold', // 헤더 타이틀의 폰트 스타일 설정
            height: 35,
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="g-translate" color={color} size={size} />
          )
        }}
        listeners={{
          tabPress: (e) => {
            // 기본 동작 방지
            e.preventDefault();
            handleTabPress('Translator');
          },
        }}
      />

      <Tab.Screen
        name="UserScreen"
        component={UserScreen}
        options={{
          //headerShown: false,
          title: '회원관리',
          headerStyle: {
            backgroundColor: '#5B36AC', // 헤더의 배경색 설정
            height: 85,
          },
          headerTintColor: '#fff', // 헤더 타이틀의 색상 설정
          headerTitleStyle: {
            fontWeight: 'bold', // 헤더 타이틀의 폰트 스타일 설정
            height: 35,
          },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" color={color} size={size} />
          )
        }}
      />


    </Tab.Navigator>
  );
}




export default MainScreen;