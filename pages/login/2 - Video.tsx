import { ResizeMode, Video } from 'expo-av';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function VideoComponent() {
  const video = useRef<Video>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: 'https://res.cloudinary.com/dvgc2tpte/video/upload/q_auto,f_auto,vc_auto,w_auto,c_scale/v1738367753/shine_2_olihuk.mp4',
        }}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
        isMuted
        onError={(error) => {
          console.error('Video playback error:', error);
          setError('Failed to play video');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.95,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
