const form = document.querySelector('form');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const email = document.querySelector('#email');
const passwordConfirm = document.querySelector('#password-confirm');
const submitButton = document.querySelector('.submit-button');

let isSavedUserInTheSystem = false;
let isRegistered = false;

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    let isFormValid = checkInputs(formData);
    if (!isFormValid) {
        return;
    }

    const randomBoolean = Math.random() < 0.5;
    submitButton.style.backgroundColor = "slategray"
    wait(1500).then(() => {
        submitButton.style.backgroundColor = "#8e44ad"
        if (randomBoolean) {
            isRegistered = true;
            showModalWindow("Congratulations! You are in!");

            const userData = {
                username: formData.get("username"),
                email: formData.get("email"),
                password: formData.get("password")
            };
            const userDataJSON = JSON.stringify(userData);
            localStorage.setItem("userData", userDataJSON);

            username.value = "";
            email.value = "";
            passwordConfirm.value = "";
            password.value = "";

            setDefaultFor(username);
            setDefaultFor(password);
            setDefaultFor(passwordConfirm);
            setDefaultFor(email);
        }
        else {
            isRegistered = false;
            showModalWindow("Oops :( Some problems have happened");
        }
    }).catch((error) => {
        console.error('Сталася помилка:', error);
    });
})

function checkInputs(formData) {
    const usernameValue = formData.get("username");
    const emailValue = formData.get("email");
    const passwordValue = formData.get("password");
    const passwordConfirmValue = formData.get("password-confirm");

    if (usernameValue === "") {
        setErrorFor(username, "Username is required");
        return false;
    }
    else {
        setSuccessFor(username);
    }

    if(emailValue === '') {
        setErrorFor(email, 'Email is required');
        return false;
    } else if (!isEmail(emailValue)) {
        setErrorFor(email, 'Not a valid email');
    } else {
        setSuccessFor(email);
    }

    if(passwordValue === '') {
        setErrorFor(password, 'Password is required');
        return false;
    } else {
        setSuccessFor(password);
    }

    if(passwordConfirmValue === '') {
        setErrorFor(passwordConfirm, 'Password confirm is required');
        return false;
    } else if(passwordValue !== passwordConfirmValue) {
        setErrorFor(passwordConfirm, 'Passwords does not match');
        return false;
    } else{
        setSuccessFor(passwordConfirm);
    }

    return true;
}

function setErrorFor(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    small.innerText = message;

    formControl.className = "form-control error";
}

function setSuccessFor(input) {
    const formControl = input.parentElement;
    formControl.className = "form-control success";
}

function setDefaultFor(input) {
    const formControl = input.parentElement;

    formControl.className = "form-control default";
}

function isEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function wait(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(); // Викликаємо resolve після закінчення затримки
        }, delay);
    });
}

const loginForm = document.querySelector('#login-form');
const loginUsername = document.querySelector('#login-username');
const loginPassword = document.querySelector('#login-password');
const submitLoginButton = document.querySelector('.submit-login-button');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isLoginFormValid = checkLoginInputs();
    if (!isLoginFormValid) {
        return;
    }

    const randomBoolean = Math.random() < 0.5;
    submitLoginButton.style.backgroundColor = "slategray"
    wait(1500).then(() => {
        submitLoginButton.style.backgroundColor = "#8e44ad"
        if (randomBoolean) {
            showModalWindow("Congratulations! You are in!");
            loginUsername.value = "";
            loginPassword.value = "";

            setDefaultFor(loginUsername);
            setDefaultFor(loginPassword);
        }
        else {
            showModalWindow("Oops :( Some problems have happened");
        }
    }).catch((error) => {
        console.error('Сталася помилка:', error);
    });
})

function checkLoginInputs() {
    const usernameValue = loginUsername.value.trim();
    const passwordValue = loginPassword.value.trim();

    if (usernameValue === "") {
        setErrorFor(loginUsername, "Username is required");
        return false;
    }
    else {
        setSuccessFor(loginUsername);
    }

    if(passwordValue === '') {
        setErrorFor(loginPassword, 'Password is required');
        return false;
    } else {
        setSuccessFor(loginPassword);
    }

    return true;
}

const tabs = document.querySelector(".tabs");
tabs.addEventListener("click", function(event) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('tab-active');
    });

    const tab = event.target.closest(".tab");
    tab.classList.add("tab-active");
});

function openTab(tabId) {
    // Знімаємо активний клас з усіх вкладок
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Приховуємо усі вмістові блоки
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Встановлюємо активну вкладку та відповідний вмістовий блок
    const tab = document.getElementById(tabId);
    tab.classList.add('active');
    const tabContent = document.getElementById('tabContent' + tabId.substr(3));
    tabContent.classList.add('active');
}

function authentification() {
    // Отримання даних з LocalStorage за ключем "userData"
    const userDataJSON = localStorage.getItem("userData");

    if (userDataJSON) {
        window.location.replace ("../Part_2/index.html");
    } else {
        console.log("Дані користувача не знайдені в LocalStorage");
    }
}

const modalWindow = document.querySelector(".successModalWindow");
const modalWindowSpan = document.querySelector(".successModalWindowSpan");
const modalWindowOkButton = document.querySelector(".successModalWindowOkButton");

async function showModalWindow(message) {
    modalWindowSpan.innerText = message.toString();
    modalWindow.style.display = "flex";
}

function hideModalWindow() {
    modalWindow.style.display = "none";
}

modalWindowOkButton.addEventListener("click", function (event) {
    hideModalWindow();

    if (isRegistered) {
        window.location.reload();
    }
});

authentification();