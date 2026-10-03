// Light obfuscation for basic scrapers; the address is not a secret.
document.querySelectorAll("[data-email]").forEach((contact) => {
  const reveal = contact.querySelector("[data-email-reveal]");
  const address = contact.querySelector("[data-email-address]");
  const copy = contact.querySelector("[data-email-copy]");
  const status = contact.querySelector("[data-email-status]");
  let resetLabel;
  let hideEmail;
  let fade;

  const resetCopyFeedback = () => {
    clearTimeout(resetLabel);
    copy.textContent = "[copy]";
    status.classList.add("visually-hidden");
    status.textContent = "";
  };

  const scheduleHide = () => {
    clearTimeout(hideEmail);
    hideEmail = setTimeout(async () => {
      const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180;
      fade = contact.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration,
        easing: "ease-out",
        fill: "forwards",
      });
      try {
        await fade.finished;
      } catch {
        return; // Copying during the fade keeps the address available.
      }

      const restoreFocus = contact.contains(document.activeElement);
      address.hidden = true;
      copy.hidden = true;
      reveal.hidden = false;
      resetCopyFeedback();
      if (restoreFocus) reveal.focus({ preventScroll: true });

      fade.cancel();
      fade = contact.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration,
        easing: "ease-in",
      });
    }, 3000);
  };

  contact.querySelector("[data-email-fallback]").hidden = true;
  reveal.hidden = false;
  reveal.addEventListener("click", () => {
    fade?.cancel();
    const email = contact.dataset.email.split("").reverse().join("");
    address.textContent = email;
    address.href = `mailto:${email}`;
    address.hidden = false;
    copy.hidden = false;
    reveal.hidden = true;
    address.focus();
    scheduleHide();
  });

  copy.addEventListener("click", async () => {
    clearTimeout(hideEmail);
    fade?.cancel();
    resetCopyFeedback();
    try {
      await navigator.clipboard.writeText(address.textContent);
      copy.textContent = "[copied]";
      status.textContent = "Email copied.";
    } catch {
      address.focus();
      const range = document.createRange();
      range.selectNodeContents(address);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.classList.remove("visually-hidden");
      status.textContent = "Email selected — copy with your keyboard or selection menu.";
    }
    resetLabel = setTimeout(() => { copy.textContent = "[copy]"; }, 2000);
    scheduleHide();
  });
});
