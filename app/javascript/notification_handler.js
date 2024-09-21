const formatDateTime = (isoString) => {
  const date = new Date(isoString);

  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  hours = hours.toString().padStart(2, '0');

  return `${month}/${day}/${year} ${hours}:${minutes}${ampm}`;
}

const handleNotification = (data) => {
  const notificationCardContainer = document.getElementById('notification-card-container');
  const notificationItems = document.querySelectorAll('.notification-item');

  let notificationExists = false;
  notificationItems.forEach((item) => {
    if (item.dataset.id == data['id']) {
      notificationExists = true;
    }
  });

  if (!notificationExists) {
    const templateCard = document.getElementById('notification-template-card');
    const newCard = templateCard.cloneNode(true);

    newCard.removeAttribute('id');
    newCard.classList.remove('hidden');
    newCard.classList.add('flex');

    newCard.dataset.id = data['id'];
    newCard.querySelector('button').dataset.notificationHideIdParam = data['id'];
    newCard.querySelector('.notification-message').innerHTML = data['message'];
    newCard.querySelector('.notification-time').innerHTML = formatDateTime(data['created_at']);

    notificationCardContainer.prepend(newCard);

    const countElement = document.getElementById('notification-count');
    const currentCount = Number(countElement.innerHTML);
    countElement.innerHTML = currentCount + 1;
  }
}

export default handleNotification;
