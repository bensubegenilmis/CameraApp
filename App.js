import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';


let camera;

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [zoomLevel, setZoomLevel] = useState(0);

  const handleCapture = async () => {
    if (camera) {
      const options = { quality: 0.7 };
      const data = await camera.takePictureAsync(options);

      await MediaLibrary.saveToLibraryAsync(data.uri) // çekilen fotoğrafı galeriye kaydetme

    }

  };

  const handleZoom = (type) => {
    setZoomLevel((prev) =>
      type === '+'
        ? prev === 100
          ? 100
          : prev + 10
        : prev === 0
          ? 0
          : prev - 10)
  }

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        zoom={zoomLevel / 100}
        ref={(ref) => { camera = ref; }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.text} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCapture}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>

          <Text>{zoomLevel / 100}</Text>

          <View style={styles.zoomContainer}>
            <TouchableOpacity
              style={styles.zoom}
              onPress={() => handleZoom("-")}
              disabled={zoomLevel / 100 === 0}
            >
              <Text style={styles.zoomtext}>-</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.zoom}
              onPress={() => handleZoom("+")}
              disabled={zoomLevel / 100 === 1}
            >
              <Text style={styles.zoomtext}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    //margin: 64,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#999",
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "flex-start",
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  zoomContainer: {
    flexDirection: "row",

  },
  zoom: {
    width: 40,
    height: 40,
    backgroundColor: "red",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
  },
  zoomtext: {
    fontSize: 30,
  },
});