const serviceUuid = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const txCharacteristic = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const rxCharacteristic = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

let myCharacteristic;
let myBLE;
let receiveText;

function bleSetup() {
  myBLE = new p5ble();

  const connectButton = createButton("Connect and Start Notifications");
  connectButton.mousePressed(connectAndStartNotify);

  const stopButton = createButton("Stop Notifications");
  stopButton.mousePressed(stopNotifications);
}

function connectAndStartNotify() {
  myBLE.connect(serviceUuid, gotCharacteristics);
}

function handleNotifications(data) {
  receiveText += data;
  if (data === "\n") {
    // 改行文字を削除し、カンマで文字列を分割して配列にする
    const values = receiveText.trim().split(',');
    
    // accY（2番目の値）が存在するか確認
    if (values.length > 1) {
      // 2番目の値（インデックス1）を浮動小数点数として解析
      const accYValue = parseFloat(values[1]);
      
      // 有効な数値であればgetValueを呼び出す
      if (!isNaN(accYValue)) {
        getValue(accYValue);
      }
    }
    receiveText = ""; // 受信テキストをリセット
  }
}

function gotCharacteristics(error, characteristics) {
  if (error) console.log("error: ", error);
  for(let i=0; i<characteristics.length; i++) {
    if(rxCharacteristic == characteristics[i].uuid) {
      myCharacteristic = characteristics[i];
      myBLE.startNotifications(myCharacteristic, handleNotifications, "string");
    }
  }
}

function stopNotifications() {
  myBLE.stopNotifications(myCharacteristic);
}