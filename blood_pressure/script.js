// BLE 相关配置
const BLE_SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0'; // 请替换为实际的服务 UUID
const BLE_CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef0'; // 请替换为实际的特征值 UUID

// 全局变量
let bleDevice = null;
let dataPoints = [];
let chart = null;
const THRESHOLD = 90;
let isAlertActive = false;

// DOM 元素
const connectBtn = document.getElementById('connectBtn');
const connectionStatus = document.getElementById('connectionStatus');
const currentPressure = document.getElementById('currentPressure');
const alertBtn = document.getElementById('alertBtn');

// 初始化图表
window.onload = function() {
    chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "血压变化趋势",
            fontSize: 16,
            fontFamily: "Microsoft YaHei"
        },
        axisX: {
            title: "时间",
            valueFormatString: "HH:mm:ss"
        },
        axisY: {
            title: "血压 (mmHg)",
            minimum: 0
        },
        data: [{
            type: "line",
            markerType: "circle",
            markerSize: 8,
            xValueType: "dateTime",
            dataPoints: dataPoints
        }]
    });
    chart.render();
};

// 连接按钮点击事件
connectBtn.addEventListener('click', async () => {
    try {
        if (bleDevice && bleDevice.gatt.connected) {
            await disconnectBLE();
        } else {
            await connectBLE();
        }
    } catch (error) {
        console.error('BLE 操作错误:', error);
        updateConnectionStatus(false);
    }
});

// 警报按钮点击事件
alertBtn.addEventListener('click', () => {
    isAlertActive = false;
    alertBtn.classList.remove('active');
    alertBtn.classList.remove('bg-red-500');
    alertBtn.classList.add('bg-green-500');
});

// 连接到 BLE 设备
async function connectBLE() {
    try {
        bleDevice = await navigator.bluetooth.requestDevice({
            filters: [{
                services: [BLE_SERVICE_UUID]
            }]
        });

        const server = await bleDevice.gatt.connect();
        const service = await server.getPrimaryService(BLE_SERVICE_UUID);
        const characteristic = await service.getCharacteristic(BLE_CHARACTERISTIC_UUID);

        await characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', handleValueChange);

        updateConnectionStatus(true);
        bleDevice.addEventListener('gattserverdisconnected', handleDisconnection);
    } catch (error) {
        console.error('连接失败:', error);
        updateConnectionStatus(false);
    }
}

// 断开 BLE 连接
async function disconnectBLE() {
    if (bleDevice && bleDevice.gatt.connected) {
        await bleDevice.gatt.disconnect();
    }
    updateConnectionStatus(false);
}

// 处理接收到的数据
function handleValueChange(event) {
    const value = event.target.value;
    const pressure = value.getUint16(0, true)/10; // 假设数据是 16 位整数

    // 更新当前值显示
    currentPressure.textContent = `${pressure} mmHg`;

    // 检查警报阈值
    if (pressure < THRESHOLD && !isAlertActive) {
        isAlertActive = true;
        alertBtn.classList.remove('bg-green-500');
        alertBtn.classList.add('bg-red-500', 'active');
    }

    // 更新图表
    dataPoints.push({
        x: new Date(),
        y: pressure
    });

    // 保持最近 50 个数据点
    if (dataPoints.length > 50) {
        dataPoints.shift();
    }

    chart.render();
}

// 处理断开连接事件
function handleDisconnection() {
    updateConnectionStatus(false);
    console.log('设备已断开连接');
}

// 更新连接状态显示
function updateConnectionStatus(connected) {
    const statusIcon = connectionStatus.querySelector('i');
    const statusText = connectionStatus.querySelector('span');
    
    if (connected) {
        statusIcon.classList.remove('text-gray-400');
        statusIcon.classList.add('text-green-500');
        statusText.textContent = '已连接';
        connectBtn.querySelector('span').textContent = '断开连接';
        connectionStatus.classList.add('status-connected');
    } else {
        statusIcon.classList.remove('text-green-500');
        statusIcon.classList.add('text-gray-400');
        statusText.textContent = '未连接';
        connectBtn.querySelector('span').textContent = '连接设备';
        connectionStatus.classList.remove('status-connected');
    }
}
