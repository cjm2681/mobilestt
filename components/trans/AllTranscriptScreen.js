import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, BackHandler } from 'react-native';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const AllTranscriptScreen = ({ navigation }) => {
    const [transcripts, setTranscripts] = useState([]);

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


    useEffect(() => {
        const fetchTranscripts = async () => {
            try {
                const response = await axios.get('http://220.94.222.233:4000/allUserTranscriptions');
                setTranscripts(response.data);
            } catch (error) {
                console.error('Error fetching transcripts:', error);
                Alert.alert('Error', 'Failed to load transcripts');
            }
        };

        fetchTranscripts();
    }, []);




    return (


        <ScrollView style={styles.container}>
            <View style={styles.infoContainer}>
                <View style={styles.historyGroup}>
                    <Text style={styles.infoUserTitle}>변환기록</Text>
                </View>

                {transcripts.map((transcript, index) => (
                    <View key={index} style={styles.infoGroup2}>
                        <Text style={styles.transcriptText}>파일 이름: {transcript.audio_file_name}</Text>
                        <Text style={styles.transcriptText}>변환 시간: {new Date(transcript.created_at).toLocaleString()}</Text>
                        <Text style={styles.transcriptText}>텍스트 변환 내역:</Text>
                        <Text style={styles.transcriptContent}>{transcript.transcription_text}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        paddingBottom: 30,
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

export default AllTranscriptScreen;
