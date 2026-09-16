// Light obfuscation for basic scrapers; the address is not a secret.
document.querySelectorAll("[data-email]").forEach((contact) => {
  const reveal = contact.querySelector("[data-email-reveal]");
  const address = contact.querySelector("[data-email-address]");
  const copy = contact.querySelector("[data-email-copy]");
  const status = contact.querySelector("[data-email-status]");
  let resetLabel;

  contact.querySelector("[data-email-fallback]").hidden = true;
  reveal.hidden = false;
  reveal.addEventListener("click", () => {
    const email = contact.dataset.email.split("").reverse().join("");
    address.textContent = email;
    address.href = `mailto:${email}`;
    address.hidden = false;
    copy.hidden = false;
    reveal.hidden = true;
    address.focus();
  }, { once: true });

  copy.addEventListener("click", async () => {
    clearTimeout(resetLabel);
    copy.textContent = "[copy]";
    status.classList.add("visually-hidden");
    status.textContent = "";
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
  });
});
