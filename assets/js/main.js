// The email stays selectable when JavaScript or clipboard access is unavailable.
document.querySelectorAll("[data-copy-target]").forEach((button) => {
  const input = document.getElementById(button.dataset.copyTarget);
  const status = document.getElementById(button.dataset.copyStatus);
  if (!input || !status) return;

  button.hidden = false;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(input.value);
      status.textContent = "Email copied.";
      button.title = "Email copied.";
    } catch {
      input.focus();
      input.select();
      status.textContent = "Email selected. Press Control+C or Command+C to copy.";
      button.title = "Select the email and copy it with your keyboard.";
    }
  });
});
