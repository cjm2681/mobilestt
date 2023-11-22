import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TranscriptProvider} from './components/TranscriptContext'
import LoginScreen from './components/LoginScreen';
import SttScreen from './components/SttScreen';
import SignupScreen from './components/SignupScreen';
import MainScreen from './components/MainScreen';
import SumScreen from './components/SumScreen';
import TransSreen from './components/TransScreen'


const Stack = createStackNavigator();
const Bottom = createBottomTabNavigator();

function App() {
  return (
    <TranscriptProvider>
    
    <NavigationContainer>

      <Stack.Navigator initialRouteName="MainHome">
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
        {/* Bottom 화면 설정 */}
        <Bottom.Screen name="MainHome" component={MainScreen} options={{headerShown: false}}/>


      </Stack.Navigator>
    </NavigationContainer>

    </TranscriptProvider>
  );
}

export default App;
