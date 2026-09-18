import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  open() {
    const dialog = document.querySelector(".video-dialog")
    dialog.querySelector(".dialog-close").onclick = () => dialog.close()
    dialog.showModal()
  }
}
