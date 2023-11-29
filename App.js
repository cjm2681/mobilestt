import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TranscriptProvider} from './components/TranscriptContext'
import LoginScreen from './components/auth/LoginScreen';
import SttScreen from './components/SttScreen';
import SignupScreen from './components/auth/SignupScreen';
import MainScreen from './components/MainScreen';
import SumScreen from './components/SumScreen';
import TransSreen from './components/TransScreen'
import UserScreen from './components/user/UserScreen';
import UserInfoScreen from './components/user/UserInfoScreen';
import AllTranscriptScreen from './components/trans/AllTranscriptScreen'


const Stack = createStackNavigator();
const Bottom = createBottomTabNavigator();

function App() {
  return (
    <TranscriptProvider>
    
    <NavigationContainer>

      <Stack.Navigator initialRouteName="Login">
        {/* 로그인 화면 설정 */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ 
            title: '음성 기록 서비스',
            headerStyle: { 
              backgroundColor: '#cece9c',
            },
          
          }}
          
        />
        {/* 회원가입 화면 설정 */}
        <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{
        headerStyle: { 
          backgroundColor: '#cece9c',
        },
      }}
         />
        {/* Stt 화면 설정 */}
        <Stack.Screen name="Stt" component={SttScreen} />
        {/* Summary 화면 설정 */}
        <Stack.Screen name="Summary" component={SumScreen}/>
        {/* Trans 화면 설정 */}
        <Stack.Screen name="Trans" component={TransSreen}/>
        {/* User 화면 설정 */}
        <Stack.Screen name="User" component={UserScreen} />
        {/* UserInfo 화면 설정 */}
        <Stack.Screen name="UserInfo" component={UserInfoScreen} options={{title:'유저 정보'}}/>
        {/* AllTrans 화면 설정 */}
        <Stack.Screen name="AllTrans" component={AllTranscriptScreen} options={{title: '모든 변환 기록'}}/>


        {/* Bottom 화면 설정 */}
        <Bottom.Screen name="MainHome" component={MainScreen} options={{headerShown: false}}/>




      </Stack.Navigator>
    </NavigationContainer>

    </TranscriptProvider>
  );
}

export default App;
