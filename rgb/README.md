# BLE RGB Web App

这是一个基于Web的应用程序，用于通过蓝牙低能耗（BLE）与具有独立三色RGB的灯泡进行通信。用户可以选择颜色，并将RGB值发送到BLE设备以控制灯泡的颜色。

## 项目结构

```
ble-rgb-webapp
├── public
│   ├── index.html        # 应用的主HTML文件
│   ├── favicon.ico       # 网站的图标文件
│   └── icons
│       └── color.svg     # 调色盘的SVG图标文件
├── src
│   ├── app.js            # 应用的主JavaScript文件
│   └── styles.css        # 应用的CSS文件
├── package.json          # npm的配置文件
├── tailwind.config.js    # Tailwind CSS的配置文件
└── README.md             # 项目的文档文件
```

## 功能

- **设备搜索**：用户可以点击按钮搜索附近的BLE设备。
- **颜色选择**：页面中心有一个调色盘，用户可以选择所需的颜色。
- **RGB控制**：选中颜色后，应用会将RGB值通过GATT协议发送到BLE设备，控制灯泡的颜色。

## 安装与使用

1. 克隆项目到本地：
   ```
   git clone <repository-url>
   cd ble-rgb-webapp
   ```

2. 安装依赖：
   ```
   npm install
   ```

3. 启动开发服务器：
   ```
   npm start
   ```

4. 打开浏览器访问 `http://localhost:3000`，即可使用应用。

## 依赖项

- [Tailwind CSS](https://tailwindcss.com/) - 用于响应式设计的CSS框架。
- [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API) - 用于与BLE设备进行通信。

## 贡献

欢迎任何形式的贡献！请提交问题或拉取请求。

## 许可证

本项目采用MIT许可证。有关详细信息，请查看LICENSE文件。