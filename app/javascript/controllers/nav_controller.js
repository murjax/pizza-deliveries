import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  toggleSubmenu(event) {
    const optionsElement = document.getElementById(event.params.optionsTarget);
    optionsElement.classList.toggle("hidden");
  }

  openNotificationModal() {
    document.getElementById('notification-modal').classList.remove('hidden');
  }
}
