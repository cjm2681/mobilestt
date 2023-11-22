import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Alert  } from 'react-native';
import SttScreen from './SttScreen';
import SignupScreen from './SignupScreen';
import { MaterialIcons, FontAwesome , MaterialCommunityIcons  } from '@expo/vector-icons';
import SumScreen from './SumScreen';
import TransScreen from './TransScreen';
import { useTranscript } from './TranscriptContext';

const Tab = createBottomTabNavigator();


function MainScreen({ navigation }) {

    const { transcript } = useTranscript();

    const handleTabPress = (routeName) => {
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
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="g-translate" color = {color} size = {size} />
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
                name="User"
                component={SignupScreen}
                options={{
                    title: '회원관리',
                    tabBarIcon: ({color, size}) => (
                        <FontAwesome name="user" color={color} size={size}  />
                    )
                }}
            />


        </Tab.Navigator>
    );
}




export default MainScreen;