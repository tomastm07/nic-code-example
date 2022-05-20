//global object that holds the data to be sent
window.fwmData = {};
import intlTelInput from 'intl-tel-input';
import { initModal } from "./modal";

document.addEventListener("DOMContentLoaded", async function (event) {
  const modal = document.querySelector(".wrapper-marketing");
  initModal(modal);

  const input = document.querySelector(".fwm-content .phone");
  intlTelInput(input, {
    autoPlaceholder: "off",
  });
});
