import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, BackHandler } from 'react-native';
import { MaterialIcons  } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const AllTranscriptScreen = ({ navigation }) => {
    const [transcripts, setTranscripts] = useState([]); // 트랜스크립션 목록 상태

        // 화면 포커스 시 뒤로 가기 버튼 동작 정의
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

        // 서버에서 트랜스크립션 목록 가져오기
    const fetchTranscripts = async () => {
        try {
            const response = await axios.get('http://localhost/allUserTranscriptions');
            setTranscripts(response.data);
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', '불러오는데 실패 했습니다.');
        }
    };



    useEffect(() => {
        fetchTranscripts();
    }, []);


    // 트랜스크립션 삭제 함수
    const deleteTranscription = (transcriptionId) => {
        Alert.alert(
            '변환 기록 삭제',
            '이 변환 기록을 정말 삭제하시겠습니까?',
            [
                {
                    text: '취소',
                    style: 'cancel'
                },
                {
                    text: '삭제',
                    onPress: async () => {
                        try {
                            await axios.delete(`http://localhost/deleteTranscription/${transcriptionId}`);
                            // 삭제 후 변환 기록 목록을 다시 불러옵니다.
                            fetchTranscripts();
                        } catch (error) {
                            console.error('Error:', error);
                            Alert.alert('Error', '삭제 후 불러오는데 실패했습니다.');
                        }
                    }
                }
            ],
            { cancelable: true }
        );
    };





    return (


        <ScrollView style={styles.container}>
            <View style={styles.infoContainer}>

                {transcripts.map((transcript, index) => (
                    <View key={index} style={styles.transcriptItem}>
                        <TouchableOpacity
                            style={styles.transcriptInfo}
                            onPress={() => navigation.navigate('TransDetail', { transcriptionId: transcript.transcription_id })}
                        >
                            <View>
                                <Text style={styles.transcriptText}>파일 이름: {transcript.audio_file_name}</Text>
                                <Text style={styles.transcriptText}>변환 시간: {new Date(transcript.created_at).toLocaleString()}</Text>
                                <Text style={styles.transcriptText}>텍스트 변환 내역:</Text>
                                <Text style={styles.transcriptContent}>{transcript.transcription_text}</Text>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => deleteTranscription(transcript.transcription_id)}
                        >
                            <MaterialIcons name="delete" size={30} color="red" />
                        </TouchableOpacity>
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
    infoContainer: {
        marginTop: 16,
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
    transcriptItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        paddingVertical: 16,
        paddingHorizontal: 24,
        marginBottom: 30,
        borderRadius: 10, // 경계선 둥글기 추가
        borderWidth: 1, // 테두리 추가
        borderColor: '#ddd', // 테두리 색상
        shadowColor: '#000', // 그림자 색상
        shadowOffset: { width: 0, height: 2 }, // 그림자 위치
        shadowOpacity: 0.1, // 그림자 불투명도
        shadowRadius: 2, // 그림자 반경
    },
    transcriptInfo: {
        flex: 1,
    },
    deleteButton: {
        marginLeft: 15,
    },
});

export default AllTranscriptScreen;
