import React, { useState } from "react";
import {
  Text,
  Button,
  Alert,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BleManager } from "react-native-ble-plx";
import base64 from "react-native-base64"; // Necesario para convertir texto a base64

const manager = new BleManager();

const Welcome = () => {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [ssid, setSsid] = useState(""); // Campo para el SSID
  const [password, setPassword] = useState(""); // Campo para la contraseña
  console.log(connectedDevice);

  const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
  const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8"; // UUID del servicio WiFi
  const SSID_UUID = "abcd1234-5678-90ef-abcd-1234567890ef"; // UUID para escribir el SSID
  const PASSWORD_UUID = "dcba4321-8765-0fea-dcba-0987654321ef"; // UUID para escribir la contraseña
  const STATUS_UUID = "1122aabb-3344-5566-7788-99aabbccddeeff"; // UUID para leer el estado de conexión

  // 🔍 Escanear dispositivos BLE
  const scanDevices = () => {
    setScanning(true);
    setDevices([]);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("Error en el escaneo:", error);
        return;
      }

      if (device && device.id && device.name) {
        setDevices((prevDevices) => {
          if (!prevDevices.some((d) => d.id === device.id)) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });

    // Detener escaneo después de 10 segundos
    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
    }, 10000);
  };

  const getServicesAndCharacteristics = async (device) => {
    try {
      const services = await device.services();
      console.log("Servicios encontrados:");

      for (const service of services) {
        console.log(`🔹 Servicio: ${service.uuid}`);
        const characteristics = await service.characteristics();

        for (const char of characteristics) {
          console.log(`   - Característica: ${char.uuid}`);
        }
      }
    } catch (error) {
      console.log("Error obteniendo servicios:", error);
    }
  };

  // 🔗 Conectar con el ESP32
  const connectToDevice = async (device) => {
    try {
      console.log(`Conectando a ${device.name}...`);
      const connectedDevice = await manager.connectToDevice(device.id);

      // Descubrir todos los servicios y características
      await connectedDevice.discoverAllServicesAndCharacteristics();
      console.log("Servicios descubiertos.");

      setConnectedDevice(connectedDevice);
      Alert.alert("✅ Conectado", `Ahora estás conectado a ${device.name}`);
    } catch (error) {
      console.log("Error al conectar:", error);
      Alert.alert("Error", "No se pudo conectar al dispositivo.");
    }
  };

  // 📤 Enviar WiFi al ESP32
  const sendWifiCredentials = async (ssid, password) => {
    console.log(ssid, password);

    if (!connectedDevice) {
      Alert.alert("Error", "No hay ningún dispositivo conectado.");
      return;
    }

    try {
      console.log(`Enviando SSID: ${ssid} y Password: ${password}...`);

      const service = await connectedDevice.services();
      const targetService = service.find((s) => s.uuid === SERVICE_UUID);

      if (!targetService) {
        console.error("El servicio no fue encontrado en el dispositivo.");
        return;
      }

      const characteristics = await targetService.characteristics();
      const targetCharacteristic = characteristics.find(
        (c) => c.uuid === CHARACTERISTIC_UUID
      );

      if (!targetCharacteristic) {
        console.error("La característica no fue encontrada.");
        return;
      }

      const wifiData = `${ssid},${password}`;
      const wifiDataEncoded = btoa(wifiData);

      await targetCharacteristic.writeWithResponse(wifiDataEncoded);
      console.log("✅ Credenciales WiFi enviadas correctamente.");
    } catch (error) {
      console.error("Error enviando credenciales WiFi:", error);
    }
  };

  return (
    <SafeAreaView className='bg-[#f3f3f3] h-full p-4'>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        📡 Prueba Bluetooth
      </Text>

      <Button
        title={scanning ? "Escaneando..." : "Buscar dispositivos"}
        onPress={scanDevices}
        disabled={scanning}
      />

      <Text style={{ marginTop: 20, fontWeight: "bold" }}>
        🔍 Dispositivos encontrados:
      </Text>

      <ScrollView style={{ marginTop: 10 }}>
        {devices.map((device) => (
          <TouchableOpacity
            key={device.id}
            style={{
              padding: 10,
              marginVertical: 5,
              backgroundColor:
                connectedDevice?.id === device.id ? "green" : "lightgray",
              borderRadius: 5,
            }}
            onPress={() => connectToDevice(device)}
          >
            <Text style={{ fontWeight: "bold" }}>{device.name}</Text>
            <Text>ID: {device.id}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {connectedDevice && (
        <>
          <Button
            title='get credentials'
            onPress={() => getServicesAndCharacteristics(connectedDevice)}
          />

          <Text style={{ marginTop: 20, fontWeight: "bold" }}>
            💾 Configuración WiFi
          </Text>

          <TextInput
            placeholder='SSID'
            value={ssid}
            onChangeText={setSsid}
            style={{
              backgroundColor: "white",
              padding: 8,
              marginTop: 5,
              borderRadius: 5,
            }}
          />
          <TextInput
            placeholder='Contraseña'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{
              backgroundColor: "white",
              padding: 8,
              marginTop: 5,
              borderRadius: 5,
            }}
          />

          <Button
            title='Enviar Configuración WiFi'
            onPress={sendWifiCredentials}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default Welcome;
