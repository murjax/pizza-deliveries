import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal"];

  closeModal() {
    this.modalTarget.classList.add('hidden');
  }

  markHidden(event) {
    const target = event.target;
    const id = event.params.hideId;
    const body = JSON.stringify({ notification: { hidden: true } });

    fetch(`/notifications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body
    });
    target.closest('.notification-item').remove();

    const countElement = document.getElementById('notification-count');
    const currentCount = Number(countElement.innerHTML);
    countElement.innerHTML = currentCount - 1;
  }
}
