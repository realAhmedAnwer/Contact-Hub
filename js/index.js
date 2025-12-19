// START GLOBAL VARIABLES
var contacts = fetchLocalStorageData();
var avatarColors = [
  { from: "#ff2056", to: "#e60076" },
  { from: "#4facfe", to: "#00f2fe" },
  { from: "#43e97b", to: "#38f9d7" },
  { from: "#fa709a", to: "#fee140" },
  { from: "#667eea", to: "#764ba2" },
  { from: "#f093fb", to: "#f5576c" },
  { from: "#5eeff5", to: "#4568dc" },
  { from: "#f6d365", to: "#fda085" },
  { from: "#13f1fc", to: "#0470dc" },
  { from: "#b224ef", to: "#7579ff" },
  { from: "#ff9a9e", to: "#fecfef" },
  { from: "#00c6fb", to: "#005bea" },
  { from: "#f9d423", to: "#ff4e50" },
  { from: "#8e2de2", to: "#4a00e0" },
  { from: "#11998e", to: "#38ef7d" },
];
var contactIdInput = document.getElementById("contactIdInput");
var nameInput = document.getElementById("nameInput");
var phoneInput = document.getElementById("phoneInput");
var emailInput = document.getElementById("emailInput");
var addressInput = document.getElementById("addressInput");
var notesInput = document.getElementById("notesInput");
var groupInput = document.getElementById("groupInput");
var avatarPathInput = document.getElementById("avatarPathInput");
var isFavouriteInput = document.getElementById("isFavouriteInput");
var isEmergencyInput = document.getElementById("isEmergencyInput");
var searchInput = document.getElementById("searchInput");
var showAvatarLogo = document.getElementById("showAvatarLogo");
var showAvatar = document.getElementById("showAvatar");
var contactModal = document.getElementById("contactModal");
var cancelButton = document.getElementById("cancelButton");
var closeButton = document.getElementById("closeButton");
var pickAvatar = document.getElementById("pickAvatar");
var addContactButton = document.getElementById("addContactButton");
var saveContactButton = document.getElementById("saveContactButton");
var nameInputError = document.getElementById("nameInputError");
var phoneInputError = document.getElementById("phoneInputError");
var emailInputError = document.getElementById("emailInputError");
// END   GLOBAL VARIABLES
// START HELPERS
function countTotalContacts() {
  return contacts.length;
}
function countFavouriteContacts() {
  return contacts.filter((contact) => contact.isFavourite == true).length;
}
function countEmergencyContacts() {
  return contacts.filter((contact) => contact.isEmergency == true).length;
}
function getAvatarChars(name) {
  name = name.split(" ");
  if (name.length > 1) {
    return name[0][0] + name[name.length - 1][0];
  } else {
    return name[0][0];
  }
}
function getRandomGradientColorStyle() {
  var pickedColor =
    avatarColors[Math.floor(Math.random() * avatarColors.length)];
  return `background-image: linear-gradient(to bottom right, ${pickedColor.from}, ${pickedColor.to})`;
}
function handleErrors(contact) {
  if (!validateName(contact.name)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Name",
      text: "Name should contain only letters and spaces (2-50 characters)",
    });
    return false;
  } else if (!validatePhone(contact.phone)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Phone",
      text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)",
    });
    return false;
  } else if (!contactIdInput.value && getDuplicatePhone(contact.phone)) {
    Swal.fire({
      icon: "error",
      title: "Duplicate Phone Number",
      text:
        "A contact with this phone number already exists: " +
        getDuplicatePhone(contact.phone).name,
    });
    return false;
  } else if (!validateEmail(contact.email)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Email",
      text: "Please enter a valid email address",
    });
    return false;
  }
  return true;
}
function validateName(name) {
  var namePattern = /^[a-zA-Z\u0600-\u06FF\s]{2,50}$/;
  if (namePattern.test(name)) {
    return true;
  } else {
    return false;
  }
}
function validatePhone(phone) {
  var phonePattern = /^(\+2|002|2)?01[0125][0-9]{8}$/;
  if (phonePattern.test(phone)) {
    return true;
  } else {
    return false;
  }
}
function validateEmail(email) {
  var emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!email || emailPattern.test(email)) {
    return true;
  } else {
    return false;
  }
}
function getDuplicatePhone(phone) {
  return contacts.find((contact) => contact.phone === phone);
}
function getUnifiedPhonePattern(phone) {
  return phone.slice(-11);
}
function updateLocalStorageData(contacts) {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}
function fetchLocalStorageData() {
  return JSON.parse(localStorage.getItem("contacts")) || [];
}
function generateUniqueId() {
  return crypto.randomUUID();
}
// END   HELPERS
// START ACTIONS
function resetInputs() {
  contactIdInput.value = "";
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
  addressInput.value = "";
  notesInput.value = "";
  groupInput.value = "";
  avatarPathInput.value = "";
  isFavouriteInput.checked = false;
  isEmergencyInput.checked = false;
}
function openContactModal() {
  contactModal.classList.remove("d-none");
  contactModal.classList.add("d-flex");
  if (getInputsValues().avatar == "") {
    showAvatarLogo.classList.remove("d-none");
    showAvatar.classList.add("d-none");
  } else {
    showAvatarLogo.classList.add("d-none");
    showAvatar.classList.remove("d-none");
    showAvatar.src = getInputsValues().avatar;
  }
}
function closeContactModal() {
  contactModal.classList.remove("d-flex");
  contactModal.classList.add("d-none");
  resetInputs();
}
function renderContacts() {
  renderContactsCards();
  renderFavouriteContacts();
  renderEmergencyContacts();
}
function renderContactsCards() {
  var filterdContacts = contacts;
  if (searchInput.value.trim != "") {
    filterdContacts = search(searchInput.value);
  }
  document.getElementById("numberOfContacts").innerText = countTotalContacts();
  document.getElementById("totalContactsNumber").innerText =
    countTotalContacts();
  document.getElementById("favouriteContactsNumber").innerText =
    countFavouriteContacts();
  document.getElementById("emergencyContactsNumber").innerText =
    countEmergencyContacts();
  var contactCardsContainer = document.getElementById("contactCardsContainer");
  if (filterdContacts.length == 0) {
    contactCardsContainer.innerHTML = `
      <div class="no-contacts w-100 text-center py-5 my-4">
        <div class="icon d-flex justify-content-center align-items-center rounded-4 mb-3">
          <i class="fa-solid fa-address-book text-gray-3 fs-2"></i>
        </div>
        <p class="text-gray m-0 mb-1 fw-medium">No contacts found</p>
        <p class="text-gray-2 m-0 fs-7">Click "Add Contact" to get started</p>
      </div>
    `;
  } else {
    contactCardsContainer.innerHTML = filterdContacts
      .map((contact) => {
        return `
    <div class="col-12 col-md-6">
      <div
        class="contact-card rounded-4 bg-white shadow-3 overflow-hidden d-flex flex-column"
      >
        <div class="px-3 pt-3 pb-2 flex-grow-1">
          <div
            class="contact-card-header d-flex align-items-center gap-2-half mb-3"
          >
            <div
              class="avatar position-relative rounded-3-half d-flex align-items-center justify-content-center"
              style="${contact.avatarGradientStyle}"
            >
            ${
              contact.avatar
                ? `<img
                 src="${contact.avatar}"
                 alt="Contact Avatar"
                 class="w-100 h-100 d-inline-block rounded-3-half"
                />`
                : `<span class="text-uppercase fw-semibold text-white">${getAvatarChars(
                    contact.name
                  )}</span>`
            }
            ${
              contact.isFavourite
                ? `<div
                class="favourite-badge position-absolute rounded-circle d-flex align-items-center justify-content-center"
              >
                <i class="fa-solid fa-star fs-9 text-white"></i>
              </div>`
                : ""
            }
            ${
              contact.isEmergency
                ? `<div
                class="emergency-badge position-absolute rounded-circle d-flex align-items-center justify-content-center"
              >
                <i
                  class="fa-solid fa-heart-pulse fs-9 text-white"
                ></i>
              </div>`
                : ""
            }
            </div>
            <div>
              <div class="name fw-semibold mb-1">${contact.name}</div>
              <div class="phone d-flex align-items-center gap-2">
                <div
                  class="icon d-inline-block blue-badge fs-8 d-flex align-items-center justify-content-center"
                >
                  <i class="fa-solid fa-phone"></i>
                </div>
                <span class="text-gray fs-7">${contact.phone}</span>
              </div>
            </div>
          </div>
          <div class="contact-card-body mb-2-half">
            ${
              contact.email
                ? `<div class="email d-flex align-items-center gap-2 mb-2">
              <div
                class="violet-badge rounded-2 d-flex align-items-center justify-content-center"
              >
                <i class="fa-solid fa-envelope fs-8"></i>
              </div>
              <span class="fs-7 text-gray"
                >${contact.email}</span
              >
            </div>`
                : ""
            }
            ${
              contact.address
                ? `<div
              class="address d-flex align-items-center gap-2 mb-2"
            >
              <div
                class="green-badge rounded-2 d-flex align-items-center justify-content-center"
              >
                <i class="fa-solid fa-location-dot fs-8"></i>
              </div>
              <span class="fs-7 text-gray">${contact.address}</span>
            </div>`
                : ""
            }
            <div class="tags">
              ${
                contact.group
                  ? `<div
                class="tag d-inline-block rounded-2 fs-8 fw-medium px-2 py-1 text-capitalize ${contact.group}-group"
              >
                ${contact.group}
              </div>`
                  : ""
              }
              ${
                contact.isFavourite
                  ? `<div
                class="tag d-inline-block rounded-2 fs-8 fw-medium px-2 py-1 amber-badge"
              >
                <i class="fa-solid fa-star"></i>
                Favourite
              </div>`
                  : ""
              }
              ${
                contact.isEmergency
                  ? `<div
                class="tag d-inline-block rounded-2 fs-8 fw-medium px-2 py-1 rose-badge"
              >
                <i class="fa-solid fa-heart-pulse"></i>
                Emergency
              </div>`
                  : ""
              }
            </div>
          </div>
        </div>
        <div class="contact-card-footer px-3 py-2">
          <div
            class="d-flex align-items-center justify-content-between py-2"
          >
            <div class="d-flex align-items-center gap-2">
              <a
                href="tel:${contact.phone}"
                class="phone-button d-inline-block text-decoration-none rounded-2 d-flex align-items-center justify-content-center"
                title="Phone"
                ><i class="fa-solid fa-phone fs-7"></i
              ></a>
              ${
                contact.email
                  ? `<a
                href="mailto:${contact.email}"
                class="email-button d-inline-block text-decoration-none rounded-2 d-flex align-items-center justify-content-center"
                title="Email"
                ><i class="fa-solid fa-envelope fs-7"></i
              ></a>`
                  : ""
              }
            </div>
            <div class="d-flex align-items-center gap-2">
              <button
                onclick="toggleFavouriteContact('${contact.id}')"
                class="favourite-button unstyled-button rounded-2 d-flex align-items-center justify-content-center ${
                  contact.isFavourite ? "active" : ""
                }"
                title="Favourite"
              >
                <i class="${
                  contact.isFavourite ? "fa-solid" : "fa-regular"
                } fa-star fs-7"></i>
              </button>
              <button
                onclick="toggleEmergencyContact('${contact.id}')"
                class="emergency-button unstyled-button rounded-2 d-flex align-items-center justify-content-center ${
                  contact.isEmergency ? "active" : ""
                }"
                title="Emergency"
              >
                <i class="${
                  contact.isEmergency
                    ? "fa-solid fa-heart-pulse"
                    : "fa-regular fa-heart"
                } fs-7"></i>
              </button>
              <button
                class="edit-button unstyled-button rounded-2 d-flex align-items-center justify-content-center"
                title="Edit"
                onclick="editContactCard('${contact.id}')"
              >
                <i class="fa-solid fa-pen fs-7"></i>
              </button>
              <button
                class="delete-button unstyled-button rounded-2 d-flex align-items-center justify-content-center"
                title="Delete"
                onclick="deleteContactCard('${contact.id}')"
              >
                <i class="fa-solid fa-trash fs-7"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
      })
      .join("");
  }
}
function renderFavouriteContacts() {
  var favouriteContactsContainer = document.getElementById(
    "favouriteContactsContainer"
  );
  var favouriteContacts = contacts?.filter(
    (contact) => contact.isFavourite == true
  );
  if (!favouriteContacts || favouriteContacts.length == 0) {
    favouriteContactsContainer.innerHTML = `
    <p class="text-center text-gray py-3">No favourites contacts</p>
    `;
  } else {
    favouriteContactsContainer.innerHTML = favouriteContacts
      ?.map((contact) => {
        return `
      <div
        class="contact-item rounded-3-half p-2 d-flex align-items-center justify-content-between w-100 mb-2-half"
      >
        <div class="d-flex align-items-center gap-2-half">
          <div
            class="avatar d-flex align-items-center justify-content-center rounded-2"
             style="${contact.avatarGradientStyle}"
          >
          ${
            contact.avatar
              ? `<img src=${contact.avatar} alt="Avatar Profile">`
              : `<span class="text-uppercase fw-semibold text-white">${getAvatarChars(
                  contact.name
                )}</span>`
          } 
          </div>
          <div>
            <div class="name fw-medium fs-7 m-0">${contact.name}</div>
            <div class="phone fw-normal fs-8 text-gray m-0">
              ${contact.phone}
            </div>
          </div>
        </div>
        <a
          class="call-button d-flex align-items-center justify-content-center text-decoration-none rounded-2"
          href="tel:${contact.phone}"
        >
          <i class="fa-solid fa-phone fs-8"></i>
        </a>
      </div>
    `;
      })
      .join("");
  }
}
function renderEmergencyContacts() {
  var emergencyContactsContainer = document.getElementById(
    "emergencyContactsContainer"
  );
  var emergencyContacts = contacts?.filter(
    (contact) => contact.isEmergency == true
  );
  if (!emergencyContacts || emergencyContacts.length == 0) {
    emergencyContactsContainer.innerHTML = `
    <p class="text-center text-gray py-3">No emergency contacts</p>
    `;
  } else {
    emergencyContactsContainer.innerHTML = emergencyContacts
      ?.map((contact) => {
        return `
      <div
        class="contact-item rounded-3-half p-2 d-flex align-items-center justify-content-between w-100 mb-2-half"
      >
        <div class="d-flex align-items-center gap-2-half">
          <div
            class="avatar d-flex align-items-center justify-content-center rounded-2"
             style="${contact.avatarGradientStyle}"
          >
          ${
            contact.avatar
              ? `<img src=${contact.avatar} alt="Avatar Profile">`
              : `<span class="text-uppercase fw-semibold text-white">${getAvatarChars(
                  contact.name
                )}</span>`
          } 
          </div>
          <div>
            <div class="name fw-medium fs-7 m-0">${contact.name}</div>
            <div class="phone fw-normal fs-8 text-gray m-0">
              ${contact.phone}
            </div>
          </div>
        </div>
        <a
          class="call-button d-flex align-items-center justify-content-center text-decoration-none rounded-2"
          href="tel:${contact.phone}"
        >
          <i class="fa-solid fa-phone fs-8"></i>
        </a>
      </div>
    `;
      })
      .join("");
  }
}
function getInputsValues() {
  return {
    id: contactIdInput.value?.trim() || "",
    name: nameInput.value.trim(),
    phone: getUnifiedPhonePattern(phoneInput.value.trim()),
    email: emailInput.value?.trim() || "",
    address: addressInput.value?.trim() || "",
    notes: notesInput.value?.trim() || "",
    group: groupInput.value?.trim() || "",
    avatar: avatarPathInput.value?.trim() || "",
    isFavourite: isFavouriteInput.checked || false,
    isEmergency: isEmergencyInput.checked || false,
  };
}
function setContact(currentInputsValues) {
  var contact = {
    id: generateUniqueId(),
    name: currentInputsValues.name,
    phone: currentInputsValues.phone,
    email: currentInputsValues.email,
    address: currentInputsValues.address,
    notes: currentInputsValues.notes,
    group: currentInputsValues.group,
    avatar: currentInputsValues.avatar,
    avatarGradientStyle: getRandomGradientColorStyle(),
    isFavourite: currentInputsValues.isFavourite,
    isEmergency: currentInputsValues.isEmergency,
  };
  contacts.push(contact);
  updateLocalStorageData(contacts);
}
function deleteContact(id) {
  contacts = contacts.filter((contact) => contact.id != id);
}
function deleteContactCard(id) {
  Swal.fire({
    icon: "warning",
    title: "Delete Contact?",
    text: "Are you sure you want to delete Ahmed Anwer? This action cannot be undone.",
    showDenyButton: true,
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: "Cancel",
    denyButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isDenied) {
      deleteContact(id);
      updateLocalStorageData(contacts);
      renderContacts();
      Swal.fire({
        title: "Deleted!",
        text: "Contact has been deleted.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}
function editContactCard(id) {
  var contact = contacts.find((contact) => contact.id == id);
  contactIdInput.value = id;
  nameInput.value = contact.name;
  phoneInput.value = contact.phone;
  emailInput.value = contact.email;
  addressInput.value = contact.address;
  notesInput.value = contact.notes;
  groupInput.value = contact.group;
  avatarPathInput.value = contact.avatar;
  isFavouriteInput.checked = contact.isFavourite;
  isEmergencyInput.checked = contact.isEmergency;
  openContactModal();
}
function updateContact(id, currentInputsValues) {
  const contact = contacts.filter((contact) => contact.id == id)[0];
  contact.name = currentInputsValues.name;
  contact.phone = currentInputsValues.phone;
  contact.email = currentInputsValues.email;
  contact.address = currentInputsValues.address;
  contact.notes = currentInputsValues.notes;
  contact.group = currentInputsValues.group;
  contact.avatar = currentInputsValues.avatar;
  contact.isFavourite = currentInputsValues.isFavourite;
  contact.isEmergency = currentInputsValues.isEmergency;
  updateLocalStorageData(contacts);
}
function toggleFavouriteContact(id) {
  const contact = contacts.find((contact) => contact.id == id);
  contact.isFavourite = !contact.isFavourite;
  updateLocalStorageData(contacts);
  renderContactsCards();
  renderFavouriteContacts();
}
function toggleEmergencyContact(id) {
  const contact = contacts.find((contact) => contact.id == id);
  contact.isEmergency = !contact.isEmergency;
  updateLocalStorageData(contacts);
  renderContactsCards();
  renderEmergencyContacts();
}
function search(text) {
  text = text.trim().toLowerCase();
  var results = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(text) ||
      contact.phone.toLowerCase().includes(text) ||
      contact.email.toLowerCase().includes(text)
  );
  return results;
}
// END   ACTIONS
// START EVENTS
pickAvatar.addEventListener("change", function (e) {
  var fileName = e.target.files[0]?.name;
  fileName && (avatarPathInput.value = "./img/" + fileName);
});
nameInput.addEventListener("keyup", function (e) {
  if (validateName(e.target.value)) {
    nameInputError.classList.add("d-none");
  } else {
    nameInputError.classList.remove("d-none");
  }
});
phoneInput.addEventListener("keyup", function (e) {
  if (validatePhone(e.target.value)) {
    phoneInputError.classList.add("d-none");
  } else {
    phoneInputError.classList.remove("d-none");
  }
});
emailInput.addEventListener("keyup", function (e) {
  if (validateEmail(e.target.value)) {
    emailInputError.classList.add("d-none");
  } else {
    emailInputError.classList.remove("d-none");
  }
});
addContactButton.addEventListener("click", function () {
  openContactModal();
});
cancelButton.addEventListener("click", function () {
  closeContactModal();
});
closeButton.addEventListener("click", function () {
  closeContactModal();
});
saveContactButton.addEventListener("click", function () {
  var contact = getInputsValues();
  if (handleErrors(contact)) {
    if (contactIdInput.value) {
      updateContact(contactIdInput.value, contact);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Contact has been updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      setContact(contact);
      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Contact has been added successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
    closeContactModal();
    renderContacts();
  }
});
searchInput.addEventListener("keyup", renderContactsCards);
// END   EVENTS
// START INITIALIZATION
renderContacts();
// END   INITIALIZATION
