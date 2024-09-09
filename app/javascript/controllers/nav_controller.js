import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  openNotificationModal() {
    document.getElementById('notification-modal').classList.remove('hidden');
  }
}
