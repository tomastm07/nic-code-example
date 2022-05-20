import { sendData } from "./services";

export const hideElement = (element, unselected = false) => {
  element?.classList.remove("active");

  if (unselected) {
    element?.classList.add("unselected");
    setTimeout(() => {
      element?.classList.remove("unselected");
    }, 3500);
  }
};
export const enableElement = (element) => element?.classList.add("active");

const skipChoice = (currentStep, nextStep, index) => {
  nextStep.classList.add("skipped");
  hideElement(currentStep);
  enableElement(nextStep.nextElementSibling);

  return true;
};

const validateEmail = (email) => {
  if (!email) return;
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
// Back button
const initBackButton = (btn) => {
  btn.addEventListener("click", () => {
    const contentActive = document.querySelector(".fwm-content.active");
    const prevActive = contentActive.previousSibling;

    hideElement(contentActive);

    const index = prevActive.getAttribute("data-id")?.split("fwm-content-")[1];
    if (index === "help-in") {
      btn.classList.add("hidden");
      const header = document.querySelector(".fwm-header");
      enableElement(prevActive);
      enableElement(header);
      return;
    }

    if (prevActive.classList.contains("skipped")) {
      const skipped = document.querySelectorAll(".fwm-content.skipped");

      if (skipped && skipped.length >= 1) {
        const first = skipped[0]?.previousSibling;
        const skippedArray = Array.from(skipped);

        if (skippedArray[0].getAttribute('data-id') == "fwm-content-ads-channels") {
          enableElement(prevActive.previousSibling);
        } else {
          enableElement(prevActive);
        }

        skipped.forEach((skp) =>
          skp.classList.remove(...["skipped", "active"])
        );

        if (first) {
          if (
            first.getAttribute("data-id")?.split("fwm-content-")[1] ===
            "help-in"
          ) {
            btn.classList.add("hidden");
            const header = document.querySelector(".fwm-header");
            enableElement(header);
            enableElement(first);
            
            return;
          }
        }
      }
    } else {
      enableElement(prevActive);
    }
  });
};
const resetModal = () => {
  const modal = document.querySelector(".wrapper-marketing");
  window.fwmData = {};
  const activeContent = modal.querySelector(".fwm-content.active");
  const firstStep = modal.querySelector(
    '.fwm-content[data-id="fwm-content-help-in"]'
  );
  const header = modal.querySelector(".fwm-header");
  const choices = modal.querySelectorAll("li");
  const textArea = modal.querySelector("textArea");
  const inputs = modal.querySelectorAll("input");
  hideElement(activeContent);
  enableElement(firstStep);
  enableElement(header);
  choices.forEach((btn) => {
    hideElement(btn);
    btn.classList.remove("skipped");
  });
  textArea.value = "";
  inputs.forEach((input) => (input.value = ""));
};

const initToggleModal = (modal, toggles) => {
  var arrToggles = [...toggles];
  arrToggles.forEach((toggle, index) => {
    toggle.addEventListener('click', (event) =>{
      modal.style.display = 'flex';
    })
  });
};

const initCloseBtn = (btn, modal) => {
  btn.addEventListener("click", function () {
    modal.style.display = "none";

    if (modal.querySelector("#thk.fwm-content.active")) {
      resetModal(modal);
    }
  });
};
const initTalkToMeBtn = (btn, modal) => {
  btn.addEventListener("click", function () {
    document.getElementById("lets-talk-btn").click();
    modal.style.display = "none";
    //resetModal(modal);
  });
};
const initChoiceButtons = (steps) => {
  for (let step of steps) {
    const multi = step.isMultiChoice;
    const buttons = step.buttons;
    if (multi) {
      buttons.forEach((btn) =>
        btn.addEventListener("click", () => {
          buttons.forEach((btn) => hideElement(btn));
          enableElement(btn);
        })
      );
      continue;
    }
    buttons.forEach((btn) =>
      btn.addEventListener("click", () => {
        if (btn.classList.contains("active")) {
          hideElement(btn, true);
        } else {
          enableElement(btn);
        }
      })
    );
  }
  const textareaBtn = document.querySelectorAll(
    ".fwm-content[data-id='fwm-content-marketing-goals'] li"
  );
  textareaBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      const textarea = document.querySelector(
        ".fwm-content[data-id='fwm-content-marketing-goals'] textarea"
      );
      if (btn.classList.contains("openTextarea")) {
        textarea.classList.remove("hidden");
      } else {
        textarea.classList.add("hidden");
      }
    });
  });
};

//this functions add data to fwmData global variable from each of the steps
const checkContentData = (ul, textArea, isMulti, index) => {
  if (ul) {
    const selectedBtns = ul.querySelectorAll("li.active");
    if (selectedBtns.length <= 0 && index !== "seo-knowledge") {
      Toast("ERROR: select at least one button.").showToast();
      return false;
    }
    if (!isMulti && selectedBtns.length > 1) {
      Toast("ERROR: multiple values selected.").showToast();
      return false;
    }
    window.fwmData[index].selectedChoices = Array.from(selectedBtns).map(
      (btn) => btn.innerHTML
    );
  }
  if (textArea) {
    window.fwmData[index].feedBack = textArea.value;
  }
};
const validateAboutForm = (formData) => {
  if (formData.length >= 1) {
    initCloseBtn;
    const arrayFormData = Array.from(formData);
    const email = arrayFormData.find((input) =>
      input.classList.contains("business-email")
    );
    if (!validateEmail(email?.value)) {
      Toast("ERROR: Make sure to type a valid email address.").showToast();
      return false;
    }
    const phone = arrayFormData.find((e) => e.classList.contains("phone"));
    let iti = window.intlTelInputGlobals.getInstance(phone);
    if (phone.value.length == 0) {
      console.log('Optional')
    } else {
      if (phone && phone.value?.length < 11 && phone.value?.length > 15) {
        Toast("ERROR: Invalid phone number.").showToast();
        return false;
      }
      if (!iti.isValidNumber()) {
        Toast("ERROR: Invalid phone number.").showToast();
        return false;
      }
    }

    if (arrayFormData.find((e) => e.required && !e.value)) {
      Toast("ERROR: Please fill out all missing required values.").showToast();
      return false;        const skippeded = skipped[1]
    }
    window.fwmData["customer-data"] = arrayFormData.map((data) => ({
      inputName: data.name,
      inputValue: data.value,
    }));
  }
};
const initContinue = (continueBtn, backButton) => {
  continueBtn.addEventListener("click", function () {
    let skipped = false;
    const activeContent = document.querySelector(".fwm-content.active");
    const header = document.querySelector(".fwm-header");

    const nextActive = document.querySelector(
      ".fwm-content.active + .fwm-content"
    );
    if (continueBtn.classList.contains("back")) {
      location.replace(window.location.origin);
      return;
    }
    const index = activeContent
      .getAttribute("data-id")
      ?.split("fwm-content-")[1];
    const nextIndex = nextActive
      .getAttribute("data-id")
      ?.split("fwm-content-")[1];

    if (index === "help-in") {
      backButton.classList.remove("hidden");
      hideElement(header);
    }

    if (!index) {
      Toast("ERROR: No Index found.").showToast();
    }

    if (!window.fwmData[index]) {
      window.fwmData[index] = {};
    }

    const isMulti = activeContent.querySelector(".fwm-suggestion");
    const ul = activeContent.querySelector("ul:not(.empty-choice)");

    const textArea = activeContent.querySelector("textarea");

    const check = checkContentData(ul, textArea, isMulti, index);

    // Disables some steps based on answers in Help in
    const SEOSelected = fwmData["help-in"]?.selectedChoices.find(
      (e) => e === "SEO"
    );
    const adsSelected = fwmData["help-in"]?.selectedChoices.find(
      (e) => e === "Paid Ads"
    );

    if (nextIndex === "seo-knowledge") {
      if (!adsSelected && !SEOSelected) {
        hideElement(activeContent);
        nextActive.classList.add("skipped");
        nextActive.nextSibling.classList.add("skipped");
        enableElement(
          document.querySelector(
            ".fwm-content[data-id='fwm-content-marketing-goals']"
          )
        );
        return;
      }
      if (!SEOSelected) {
        skipped = skipChoice(activeContent, nextActive, nextIndex);
        return;
      }
    }
    if (nextIndex === "ads-channels") {
      if (!adsSelected) {
        skipped = skipChoice(activeContent, nextActive, nextIndex);
        return;
      }
    }

    //active the next form content
    if (check !== false) {
      hideElement(activeContent);
      enableElement(nextActive);
    }
  });
};
const initContinueBtns = (btns, backButton) => {
  btns.forEach((btn) => {
    initContinue(btn, backButton);
  });
};

const initSubmitBtn = (submitBtn, spinnerWrapper) => {
  //send data on submit
  if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
      //validate form step
      const activeContent = document.querySelector(".fwm-content.active");
      const formData = activeContent.querySelectorAll("input");

      if (validateAboutForm(formData) !== false) {
        try {
          enableElement(spinnerWrapper);
          const { status, text } = await sendData();
          const userEmail = document.querySelector(".business-email").value;
          Toast(text).showToast();
          if (status == 200) {
            setTimeout(() => {
              document.querySelector(".fwm-userEmail").innerHTML = userEmail;
              //show thank you screen
              const nextActive = document.querySelector(
                ".fwm-content.active + .fwm-content"
              );
              hideElement(activeContent);
              enableElement(nextActive);
              // resetModal();
            }, 500);
          }
        } catch (error) {
          console.log(error);
          Toast(
            "ERROR: Please fill out all missing required values."
          ).showToast();
        }
      }

      hideElement(spinnerWrapper);
    });
  }
};
const getModalElements = (modal) => {
  const btnToggleModal = document.getElementsByClassName("show-marketing-modal");
  const btnTalkToMe = document.querySelector(".fwm-talk-to-me");
  const btnClose = document.querySelector(".fwm-close");
  const modalContents = modal.querySelectorAll(".fwm-content");
  const continueButtons = modal.querySelectorAll(
    ".fwm-button:not(.fwm-submit)"
  );
  const backButton = document.querySelector(".fwm-back");
  const submitBtn = document.querySelector(".fwm-submit");
  const spinnerWrapper = document.querySelector(".full-width-spinner-wrapper");
  const choiceButtons = [];
  for (const content of modalContents) {
    const wrapper = { buttons: [], isMultiChoice: undefined };
    wrapper.buttons = content.querySelectorAll("li");
    wrapper.isMultiChoice = !content.querySelector(".fwm-suggestion");
    choiceButtons.push(wrapper);
  }
  return {
    btnToggleModal,
    btnTalkToMe,
    btnClose,
    continueButtons,
    submitBtn,
    spinnerWrapper,
    choiceButtons,
    backButton,
  };
};

export const initModal = (modal) => {
  const {
    btnToggleModal,
    btnTalkToMe,
    btnClose,
    continueButtons,
    submitBtn,
    spinnerWrapper,
    choiceButtons,
    backButton,
  } = getModalElements(modal);
  initToggleModal(modal, btnToggleModal);
  initCloseBtn(btnClose, modal);
  initTalkToMeBtn(btnTalkToMe, modal);
  initChoiceButtons(choiceButtons);
  initContinueBtns(continueButtons, backButton);
  initSubmitBtn(submitBtn, spinnerWrapper);
  initBackButton(backButton);
};
