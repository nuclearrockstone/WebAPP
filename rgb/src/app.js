const serviceUUID = '12345678-1234-5678-1234-56789abcdef0';
const rUUID = '12345678-1234-5678-1234-56789abcdef1';
const gUUID = '12345678-1234-5678-1234-56789abcdef2';
const bUUID = '12345678-1234-5678-1234-56789abcdef3';

let bluetoothDevice;
let rCharacteristic;
let gCharacteristic;
let bCharacteristic;

const searchButton = document.getElementById('searchButton');
const selectedColor = document.getElementById('selectedColor');
const colorValues = document.getElementById('colorValues');

let isConnecting = false;

// 创建颜色选择器
const colorPicker = new iro.ColorPicker("#picker", {
    width: 300,
    color: "#ff0000",
    borderWidth: 1,
    borderColor: "#ccc",
    layout: [
        { 
            component: iro.ui.Wheel,
            options: {}
        }
    ]
});

// 监听颜色变化
colorPicker.on('color:change', function(color) {
    const rgb = color.rgb;
    selectedColor.style.backgroundColor = color.hexString;
    colorValues.textContent = `R: ${Math.round(rgb.r)} G: ${Math.round(rgb.g)} B: ${Math.round(rgb.b)}`;
    
    if (rCharacteristic && gCharacteristic && bCharacteristic) {
        sendColor({
            r: Math.round(rgb.r),
            g: Math.round(rgb.g),
            b: Math.round(rgb.b)
        });
    }
});

document.getElementById('searchButton').addEventListener('click', searchForDevice);

async function searchForDevice() {
    if (isConnecting) return;
    
    try {
        isConnecting = true;
        searchButton.classList.add('button-connecting');
        searchButton.textContent = '连接中...';

        bluetoothDevice = await navigator.bluetooth.requestDevice({
            filters: [{ services: [serviceUUID] }]
        });
        const server = await bluetoothDevice.gatt.connect();
        const service = await server.getPrimaryService(serviceUUID);
        
        rCharacteristic = await service.getCharacteristic(rUUID);
        gCharacteristic = await service.getCharacteristic(gUUID);
        bCharacteristic = await service.getCharacteristic(bUUID);
        
        searchButton.classList.remove('button-connecting');
        searchButton.classList.remove('bg-blue-500');
        searchButton.classList.add('bg-green-500');
        searchButton.textContent = '已连接';
    } catch (error) {
        console.error('设备连接失败:', error);
        searchButton.classList.remove('button-connecting');
        searchButton.textContent = '搜索设备';
    } finally {
        isConnecting = false;
    }
}

async function sendColor(rgb) {
    try {
        await rCharacteristic.writeValue(new Uint8Array([rgb.r]));
        await gCharacteristic.writeValue(new Uint8Array([rgb.g]));
        await bCharacteristic.writeValue(new Uint8Array([rgb.b]));
    } catch (error) {
        console.error('发送颜色失败:', error);
    }
}