import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal"];

  modalTargetConnected() {
    fetch('/notifications.json')
      .then((response) => response.json())
      .then((notifications) => {
        notifications.forEach((notification) => {
          console.log(notification)
        });
      });
  }

  closeModal() {
    this.modalTarget.classList.add('hidden');
  }
}
