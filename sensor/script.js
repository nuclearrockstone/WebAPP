const UUID_SERVICE = '12345678-1234-5678-1234-56789abcdef0';
const UUID_TEMP_NOTIFY = '12345678-1234-5678-1234-56789abcdef0';
const UUID_HUMID_NOTIFY = '12345678-1234-5678-1234-56789abcdef1';
const UUID_TEMP_WRITE = '12345678-1234-5678-1234-56789abcdef2';
const UUID_HUMID_WRITE = '12345678-1234-5678-1234-56789abcdef3';

let deviceConnection = null;

// DOM 元素
const searchButton = document.getElementById('searchDevice');
const currentTemp = document.getElementById('currentTemp');
const currentHumidity = document.getElementById('currentHumidity');
const tempSlider = document.getElementById('tempSlider');
const humiditySlider = document.getElementById('humiditySlider');
const setTemp = document.getElementById('setTemp');
const setHumidity = document.getElementById('setHumidity');

// 事件监听器
searchButton.addEventListener('click', connectToDevice);
tempSlider.addEventListener('change', updateTemperature);
humiditySlider.addEventListener('change', updateHumidity);

async function connectToDevice() {
    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [UUID_SERVICE] }]  // 添加要访问的服务UUID
        });

        searchButton.textContent = '连接中...';
        deviceConnection = await device.gatt.connect();
        const service = await deviceConnection.getPrimaryService(UUID_SERVICE);

        // 设置温度通知
        const tempCharacteristic = await service.getCharacteristic(UUID_TEMP_NOTIFY);
        await tempCharacteristic.startNotifications();
        tempCharacteristic.addEventListener('characteristicvaluechanged', handleTempChange);

        // 设置湿度通知
        const humidCharacteristic = await service.getCharacteristic(UUID_HUMID_NOTIFY);
        await humidCharacteristic.startNotifications();
        humidCharacteristic.addEventListener('characteristicvaluechanged', handleHumidChange);

        searchButton.innerHTML = '<i class="fa-brands fa-bluetooth-b mr-2"></i>已连接';
        searchButton.classList.remove('bg-blue-500', 'hover:bg-blue-600');
        searchButton.classList.add('bg-green-500', 'hover:bg-green-600');
    } catch (error) {
        console.error('连接失败:', error);
        alert('连接设备失败，请重试');
    }
}

function handleTempChange(event) {
    const value = event.target.value.getUint8(0, true);
    currentTemp.textContent = value.toFixed(1);
}

function handleHumidChange(event) {
    const value = event.target.value.getUint8(0, true);
    currentHumidity.textContent = value.toFixed(1);
}

async function updateTemperature() {
    if (!deviceConnection) return;
    
    const value = parseFloat(tempSlider.value);
    setTemp.textContent = `(设定: ${value}°C)`;
    
    try {
        const service = await deviceConnection.getPrimaryService(UUID_SERVICE);
        const characteristic = await service.getCharacteristic(UUID_TEMP_WRITE);
        
        await characteristic.writeValue(new Uint16Array([value]));
    } catch (error) {
        console.error('设置温度失败:', error);
    }
}

async function updateHumidity() {
    if (!deviceConnection) return;
    
    const value = parseFloat(humiditySlider.value);
    setHumidity.textContent = `(设定: ${value}%)`;
    
    try {
        const service = await deviceConnection.getPrimaryService(UUID_SERVICE);
        const characteristic = await service.getCharacteristic(UUID_HUMID_WRITE);
        
        await characteristic.writeValue(new Uint16Array([value]));
    } catch (error) {
        console.error('设置湿度失败:', error);
    }
}
