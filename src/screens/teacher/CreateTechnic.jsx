import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  PermissionsAndroid,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createTechnic, updateTechnic } from '../../store/slices/technicSlice';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CreateTechnic = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [videoUri, setVideoUri] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [difficulty, setDifficulty] = useState('Beginner');
  const [instrument, setInstrument] = useState('Piano');
  const [level, setLevel] = useState('1');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [technicId, setTechnicId] = useState(null);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (route.params?.technic) {
      const { technic } = route.params;
      setTitle(technic.title);
      setDescription(technic.description || '');
      setImageUri(technic.imageUrl);
      setVideoUri(technic.videoUrl);
      setAudioUri(technic.audioUrl);
      setDifficulty(technic.difficulty || 'Beginner');
      setInstrument(technic.instrument || 'Piano');
      setLevel(technic.level || '1');
      setIsEditing(true);
      setTechnicId(technic.id);
    }
  }, [route.params]);

  const handleImagePick = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      console.log('Image result>>>>>>>', result);

      if (!result.didCancel && result.assets && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      } else {
        console.log('Image selection was cancelled');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleVideoPick = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'video',
        quality: 0.8,
      });

      console.log('Video result>>>>>', result);

      if (!result.didCancel && result.assets && result.assets[0]) {
        setVideoUri(result.assets[0].uri);
      } else {
        console.log('Video selection was cancelled');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video');
    }
  };

  const handleAudioPick = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'audio',
      });

      console.log('Audio picker result:', result);

      if (result && result[0]) {
        console.log('Selected audio file:', result[0]);
        setAudioUri(result[0].uri);
      } else {
        console.log('Audio selection was cancelled');
      }
    } catch (error) {
        Alert.alert('Error', 'Failed to pick audio file');
      }
    
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the technique');
      return;
    }

    if (!user || !user.uid) {
      Alert.alert('Error', 'You must be logged in to create a technique');
      return;
    }

    try {
      setLoading(true);
      const technicData = {
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUri,
        videoUrl: videoUri,
        audioUrl: audioUri,
        userId: user.uid,
        userEmail: user.email,
        difficulty,
        instrument,
        level,
      };

      if (isEditing) {
        technicData.id = technicId;
        await dispatch(updateTechnic(technicData)).unwrap();
      } else {
        await dispatch(createTechnic(technicData)).unwrap();
      }

      Alert.alert(
        'Success',
        `Technique ${isEditing ? 'updated' : 'created'} successfully!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
      
    } catch (error) {
      Alert.alert(
        'Error',
        `Failed to ${isEditing ? 'update' : 'save'} technique: ${error}`
      );
    } finally {
      setLoading(false);
    }
  };

  const instrumentList = ['Piano', 'Guitar', 'Violin', 'Drums', 'Flute'];
  const levelList = ['1', '2', '3', '4', '5'];
  const DifficultyList = ['Beginner', 'Intermediate', 'Advanced'];
  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter technique title"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter technique description"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Instrument</Text>
        <View style={styles.instrumentContainer}>
          {instrumentList.map((inst) => (
            <TouchableOpacity
              key={inst}
              style={[
                styles.instrumentButton,
                instrument === inst && styles.selectedInstrument,
              ]}
              onPress={() => setInstrument(inst)}
            >
              <Text
                style={[
                  styles.instrumentText,
                  instrument === inst && styles.selectedInstrumentText,
                ]}
              >
                {inst}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Level</Text>
        <View style={styles.levelContainer}>
          {levelList.map((lvl) => (
            <TouchableOpacity
              key={lvl}
              style={[
                styles.levelButton,
                level === lvl && styles.selectedLevel,
              ]}
              onPress={() => setLevel(lvl)}
            >
              <Text
                style={[
                  styles.levelText,
                  level === lvl && styles.selectedLevelText,
                ]}
              >
                {lvl}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Difficulty Level</Text>
        <View style={styles.difficultyContainer}>
          {DifficultyList.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.difficultyButton,
                difficulty === level && styles.selectedDifficulty,
              ]}
              onPress={() => setDifficulty(level)}
            >
              <Text
                style={[
                  styles.difficultyText,
                  difficulty === level && styles.selectedDifficultyText,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Image</Text>
        <TouchableOpacity
          style={styles.mediaButton}
          onPress={handleImagePick}
        >
          <Icon name="image" size={24} color="#6200EE" />
          <Text style={styles.mediaButtonText}>
            {imageUri ? 'Change Image' : 'Select Image'}
          </Text>
        </TouchableOpacity>
        {imageUri && (
                   <View style={styles.mediaPreview}>
                     <Image source={{ uri: imageUri }} style={styles.previewImage} />
                     <TouchableOpacity 
                       style={styles.removeButton}
                       onPress={() => setImageUri(null)}
                     >
                       <Icon name="times-circle" size={24} color="#6200EE" />
                     </TouchableOpacity>
                   </View>
                 )}

        <Text style={styles.label}>Video</Text>
        <TouchableOpacity
          style={styles.mediaButton}
          onPress={handleVideoPick}
        >
          <Icon name="video-camera" size={24} color="#6200EE" />
          <Text style={styles.mediaButtonText}>
            {videoUri ? 'Change Video' : 'Select Video'}
          </Text>
        </TouchableOpacity>

        
                  {videoUri && (
                    <View style={styles.mediaPreview}>
                      <View style={styles.videoPreview}>
                        <Icon name="play-circle" size={40} color="#6200EE" />
                        <Text style={styles.videoText}>Video Selected</Text>
                        <Text style={styles.videoUriText} numberOfLines={1} ellipsizeMode="middle">
                          {videoUri.split('/').pop()}
                        </Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => setVideoUri(null)}
                      >
                        <Icon name="times-circle" size={24} color="#6200EE" />
                      </TouchableOpacity>
                    </View>
                  )}

        <Text style={styles.label}>Audio</Text>
        <TouchableOpacity
          style={styles.mediaButton}
          onPress={handleAudioPick}
        >
          <Icon name="music" size={24} color="#6200EE" />
          <Text style={styles.mediaButtonText}>
            {audioUri ? 'Change Audio' : 'Select Audio'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#6200EE" />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update Technique' : 'Create Technique'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    elevation: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  instrumentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  instrumentButton: {
    flex: 1,
    minWidth: '30%',
    padding: 12,
    marginHorizontal: 4,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    elevation: 2,
  },
  selectedInstrument: {
    backgroundColor: '#6200EE',
  },
  instrumentText: {
    fontSize: 14,
    color: '#333',
  },
  selectedInstrumentText: {
    color: '#FFFFFF',
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  levelButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    elevation: 2,
  },
  selectedLevel: {
    backgroundColor: '#6200EE',
  },
  levelText: {
    fontSize: 14,
    color: '#333',
  },
  selectedLevelText: {
    color: '#FFFFFF',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  difficultyButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    elevation: 2,
  },
  selectedDifficulty: {
    backgroundColor: '#6200EE',
  },
  difficultyText: {
    fontSize: 14,
    color: '#333',
  },
  selectedDifficultyText: {
    color: '#FFFFFF',
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  mediaButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6200EE',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#6200EE',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
  },
  mediaPreview: {
    marginTop: 20,
    position: 'relative',
  },
  videoPreview: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  videoText: {
    marginTop: 10,
    color: '#424242',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoUriText: {
    marginTop: 5,
    color: '#757575',
    fontSize: 12,
    textAlign: 'center',
    maxWidth: '90%',
  },
});

export default CreateTechnic; 