import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal"];

  closeModal() {
    this.modalTarget.classList.add('hidden');
  }
}
