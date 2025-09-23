export default function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const popup = document.getElementById('popup');
  const okBtn = document.getElementById('popup-ok');

  // --- Validáció segédfüggvény ---
  function validateForm() {
    let isValid = true;

    // minden hibaüzenet törlése
    form.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    // first name
    const firstName = form.querySelector('[name="first_name"]');
    if (!firstName.value.trim()) {
      firstName.nextElementSibling.textContent = 'First name is required';
      isValid = false;
    }

    // last name
    const lastName = form.querySelector('[name="last_name"]');
    if (!lastName.value.trim()) {
      lastName.nextElementSibling.textContent = 'Last name is required';
      isValid = false;
    }

    // email
    const email = form.querySelector('[name="email"]');
    const emailVal = email.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
    if (!regex.test(emailVal)) {
      email.nextElementSibling.textContent = 'Please enter a valid email.';
      isValid = false;
    }

    // message
    const message = form.querySelector('[name="message"]');
    if (!message.value.trim()) {
      message.nextElementSibling.textContent = 'Message is required';
      isValid = false;
    }

    return isValid;
  }

  // --- Form submit ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
      });

      form.reset();

      if (popup) {
        popup.style.display = 'flex';
        popup.setAttribute('aria-hidden', 'false');
      }
    } catch (err) {
      alert('Hiba történt az elküldés során.');
      console.error(err);
    }
  });

  // --- Popup ok gomb ---
  okBtn?.addEventListener('click', () => {
    if (popup) {
      popup.style.display = 'none';
      popup.setAttribute('aria-hidden', 'true');
    }
  });
}
