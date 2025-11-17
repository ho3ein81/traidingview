// cryptoSocket.ts

// وقتی اتصال برقرار شد
socket.addEventListener('open', () => {
  console.log('WebSocket connected');
});

// وقتی پیام از سرور رسید
socket.addEventListener('message', (event) => {
  console.log('Message from server:', event.data);
  // داده‌ها می‌تونن JSON باشن:
  // const prices = JSON.parse(event.data);
});

export default socket;
