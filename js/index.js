var contacts = fetchLocalStorageData();
// START RESET FORM INPUTS
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
// END   RESET FORM INPUTS
function openContactModal() {
  contactModal.classList.remove("d-none");
  contactModal.classList.add("d-flex");
}
function closeContactModal() {
  contactModal.classList.remove("d-flex");
  contactModal.classList.add("d-none");
  resetInputs();
}
// START GETTING CURRENT INPUTS VALUES
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
// END   GETTING CURRENT INPUTS VALUES
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
    isFavourite: currentInputsValues.isFavourite,
    isEmergency: currentInputsValues.isEmergency,
  };
  contacts.push(contact);
  updateLocalStorageData(contacts);
}
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

var contactModal = document.getElementById("contactModal");
var cancelButton = document.getElementById("cancelButton");
var closeButton = document.getElementById("closeButton");
var pickAvatar = document.getElementById("pickAvatar");
var addContactButton = document.getElementById("addContactButton");
var saveContactButton = document.getElementById("saveContactButton");

// start error paragraphs
var nameInputError = document.getElementById("nameInputError");
var phoneInputError = document.getElementById("phoneInputError");
var emailInputError = document.getElementById("emailInputError");
// end   error paragraphs

// START GETTING & SETTING SELECTED AVATAR
pickAvatar.addEventListener("change", function (e) {
  var fileName = e.target.files[0]?.name;
  fileName && (avatarPathInput.value = "./img/" + fileName);
});
// END   GETTING & SETTING SELECTED AVATAR
// START OPENING & CLOSING CONTACT MODAL
addContactButton.addEventListener("click", function () {
  openContactModal();
});
cancelButton.addEventListener("click", function () {
  closeContactModal();
});
closeButton.addEventListener("click", function () {
  closeContactModal();
});
// END   OPENING & CLOSING CONTACT MODAL

// START SAVING CONTACT
saveContactButton.addEventListener("click", function () {
  var contact = getInputsValues();
  if (handleErrors(contact)) {
    if (contactIdInput.value) {
      //edit
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Contact has been updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
      closeContactModal();
    } else {
      setContact(contact);
      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Contact has been added successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
      closeContactModal();
      renderContacts();
    }
  }
});
// END   SAVING CONTACT
// START HANDLING ERRORS
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
  } else if (getDuplicatePhone(contact.phone)) {
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
// END   HANDLING ERRORS
// START VALIDATING NAME
function validateName(name) {
  var namePattern = /^[a-zA-Z\u0600-\u06FF\s]{2,50}$/;
  if (namePattern.test(name)) {
    return true;
  } else {
    return false;
  }
}
// END   VALIDATING NAME
// START VALIDATING PHONE
function validatePhone(phone) {
  var phonePattern = /^(\+2|002|2)?01[0125][0-9]{8}$/;
  if (phonePattern.test(phone)) {
    return true;
  } else {
    return false;
  }
}
// END   VALIDATING EMAIL
function validateEmail(email) {
  var emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!email || emailPattern.test(email)) {
    return true;
  } else {
    return false;
  }
}
// END   VALIDATING EMAIL
function getDuplicatePhone(phone) {
  return contacts.find((contact) => contact.phone === phone);
}
function getUnifiedPhonePattern(phone) {
  return phone.slice(-11);
}
// START INPUTS WATHCERS
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
// END   INPUTS WATHCERS

// START UPDATING LOCAL STORAGE DATA
function updateLocalStorageData(contacts) {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}
// END UPDATING LOCAL STORAGE DATA
// START FETCHING LOCAL STORAGE DATA
function fetchLocalStorageData() {
  return JSON.parse(localStorage.getItem("contacts")) || [];
}
// END FETCHING LOCAL STORAGE DATA
function generateUniqueId() {
  return crypto.randomUUID();
}
// START SETTING VALUES
function renderContacts() {
  renderContactsCards()
}
function renderContactsCards() {
  var contactCardsContainer = document.getElementById("contactCardsContainer");
  contactCardsContainer.innerHTML = contacts.map((contact) => {
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
            >
            ${contact.avatar  
              ? `<img
                 src="${contact.avatar}"
                 alt="Contact Avatar"
                 class="w-100 h-100 d-inline-block rounded-3-half"
                />`
              : `<span class="text-uppercase fw-semibold text-white">aa</span>`
            }
            ${contact.isFavourite
              ?`<div
                class="favourite-badge position-absolute rounded-circle d-flex align-items-center justify-content-center"
              >
                <i class="fa-solid fa-star fs-9 text-white"></i>
              </div>`
              : '' 
            }
            ${contact.isEmergency
              ?`<div
                class="emergency-badge position-absolute rounded-circle d-flex align-items-center justify-content-center"
              >
                <i
                  class="fa-solid fa-heart-pulse fs-9 text-white"
                ></i>
              </div>`
              : ''
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
            ${contact.email
            ?`<div class="email d-flex align-items-center gap-2 mb-2">
              <div
                class="violet-badge rounded-2 d-flex align-items-center justify-content-center"
              >
                <i class="fa-solid fa-envelope fs-8"></i>
              </div>
              <span class="fs-7 text-gray"
                >${contact.email}</span
              >
            </div>`
            : ''
            }
            ${contact.address
            ?`<div
              class="address d-flex align-items-center gap-2 mb-2"
            >
              <div
                class="green-badge rounded-2 d-flex align-items-center justify-content-center"
              >
                <i class="fa-solid fa-location-dot fs-8"></i>
              </div>
              <span class="fs-7 text-gray">${contact.address}</span>
            </div>`
            : ''
            }
            <div class="tags">
              ${contact.group
              ?`<div
                class="tag d-inline-block rounded-2 fs-8 fw-medium px-2 py-1 text-capitalize ${contact.group}-group"
              >
                ${contact.group}
              </div>`
              : ''
              }
              ${contact.isFavourite
              ?`<div
                class="tag d-inline-block rounded-2 fs-8 fw-medium px-2 py-1 amber-badge"
              >
                <i class="fa-solid fa-star"></i>
                Favourite
              </div>`
              : ''
              }
              ${contact.isEmergency
              ?`<div
                class="tag d-inline-block rounded-2 fs-8 fw-medium px-2 py-1 rose-badge"
              >
                <i class="fa-solid fa-heart-pulse"></i>
                Emergency
              </div>`
              : ''
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
              ${contact.email
              ?`<a
                href="mailto:${contact.email}"
                class="email-button d-inline-block text-decoration-none rounded-2 d-flex align-items-center justify-content-center"
                title="Email"
                ><i class="fa-solid fa-envelope fs-7"></i
              ></a>`
              : ''
              }
            </div>
            <div class="d-flex align-items-center gap-2">
              <button
                id="isFavouriteButton"
                class="favourite-button unstyled-button rounded-2 d-flex align-items-center justify-content-center ${contact.isFavourite ? 'active' : ''}"
                title="Favourite"
              >
                <i class="${contact.isFavourite ? 'fa-solid' : 'fa-regular'} fa-star fs-7"></i>
              </button>
              <button
                id="isEmergencyButton"
                class="emergency-button unstyled-button rounded-2 d-flex align-items-center justify-content-center ${contact.isEmergency ? 'active' : ''}"
                title="Emergency"
              >
                <i class="${contact.isEmergency ? 'fa-solid fa-heart-pulse' : 'fa-regular fa-heart'} fs-7"></i>
              </button>
              <button
                id="editContactButton"
                class="edit-button unstyled-button rounded-2 d-flex align-items-center justify-content-center"
                title="Edit"
              >
                <i class="fa-solid fa-pen fs-7"></i>
              </button>
              <button
                id="deleteContactButton"
                class="delete-button unstyled-button rounded-2 d-flex align-items-center justify-content-center"
                title="Delete"
              >
                <i class="fa-solid fa-trash fs-7"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  }).join("");
}
function renderFavouriteContacts() {
  var favouriteContactsContainer = document.getElementById('favouriteContactsContainer')
  favouriteContactsContainer.innerHTML = contacts
  .filter((contact) => contact.isFavourite == true)
  .map((contact) => {
    return `
      <div
        class="contact-item rounded-3-half p-2 d-flex align-items-center justify-content-between w-100"
      >
        <div class="d-flex align-items-center gap-2-half">
          <div
            class="avatar d-flex align-items-center justify-content-center rounded-2"
          >
            <span class="text-uppercase fw-semibold text-white"
              >aa</span
            >
          </div>
          <div>
            <div class="name fw-medium fs-7 m-0">Ahmed Anwer</div>
            <div class="phone fw-normal fs-8 text-gray m-0">
              01122333444
            </div>
          </div>
        </div>
        <a
          class="call-button d-flex align-items-center justify-content-center text-decoration-none rounded-2"
          href="tel:01122333444"
        >
          <i class="fa-solid fa-phone fs-8"></i>
        </a>
      </div>
    `
  })
}
function renderEmergencyContacts() {

}
// END SETTING VALUES
