import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['modal'];

  openMessageModal() {
    const id = event.params.messageUserId;
    const form = this.modalTarget.querySelector('form').dataset.userId = id;
    this.modalTarget.classList.remove('hidden');
  }

  closeMessageModal() {
    this.modalTarget.classList.add('hidden');
  }

  sendMessage(event) {
    this.modalTarget.classList.add('hidden');

    const form = event.target.closest('form');
    const userId = form.dataset.userId;
    const textarea = form.querySelector('textarea');
    const message = textarea.value;
    textarea.value = '';

    const body = JSON.stringify({ notification: { user_id: userId, message } });

    fetch(`/users/${userId}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body
    });
  }
}
