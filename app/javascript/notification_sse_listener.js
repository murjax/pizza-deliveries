import handleNotification from './notification_handler'

const eventSource = new EventSource('/sse_notifications');

eventSource.addEventListener('notifications', (event) => {
  const eventData = JSON.parse(event.data)

  if (eventData.event == 'heartbeat') {
    console.log('heartbeat ping received');
    return;
  } else {
    const notificationData = JSON.parse(eventData.data);
    handleNotification(notificationData);
  }
});

window.addEventListener('onbeforeunload', () => {
  eventSource.close();
});
