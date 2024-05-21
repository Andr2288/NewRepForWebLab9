class User {
    static allUsers = [];

    constructor(photo, name, age, phone_number, email, location, dateJoined) {
        this.photo = photo;
        this.name = name;
        this.age = age;
        this.phone_number = phone_number;
        this.email = email;
        this.location = location; // Додано властивість місця проживання
        this.dateJoined = new Date(dateJoined); // Конвертуємо рядок дати з API в об'єкт Date

        User.allUsers.push(this);
    }

    createUserElement() {
        let userDiv = document.createElement("user");
        userDiv.classList.add("user");

        let photoElement = document.createElement("img");
        photoElement.src = this.photo;
        userDiv.appendChild(photoElement);

        let textContentDiv = document.createElement("div");

        let nameElement = document.createElement("p");
        nameElement.textContent = `Name: ${this.name}`;
        textContentDiv.appendChild(nameElement);

        let ageElement = document.createElement("p");
        ageElement.textContent = `Age: ${this.age}`;
        textContentDiv.appendChild(ageElement);

        let phoneElement = document.createElement("p");
        phoneElement.textContent = `Phone: ${this.phone_number}`;
        textContentDiv.appendChild(phoneElement);

        let emailElement = document.createElement("p");
        emailElement.textContent = `Email: ${this.email}`;
        textContentDiv.appendChild(emailElement);

        let locationElement = document.createElement("p");
        locationElement.textContent = `Location: ${this.location}`;
        textContentDiv.appendChild(locationElement);

        userDiv.appendChild(textContentDiv); // Додаємо div з усіма елементами p до елементу користувача

        let buttonElement = document.createElement("button");
        buttonElement.classList.add("hackButton");
        buttonElement.textContent = "Hack";
        buttonElement.addEventListener("click", () => {
            alert("Button clicked!"); // Повідомлення про натискання кнопки
        });

        userDiv.appendChild(buttonElement); // Додаємо div з кнопкою до елементу користувача

        this.element = userDiv;
        return userDiv;
    }

    static sortByField(field, order = 'asc') {
        if (field === "date") {
            this.allUsers.sort((a, b) => {
                const dateA = new Date(a.dateJoined);
                const dateB = new Date(b.dateJoined);
                return order === 'asc' ? dateA - dateB : dateB - dateA;
            });
            return this.allUsers;
        } else {
            const compareFunction = (a, b) => {
                const valueA = typeof a[field] === 'string' ? a[field].toLowerCase() : a[field];
                const valueB = typeof b[field] === 'string' ? b[field].toLowerCase() : b[field];

                if (order === 'asc') {
                    return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
                } else {
                    return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
                }
            };

            return this.allUsers.slice().sort(compareFunction);
        }
    }

    addToContainer(container) {
        container.appendChild(this.createUserElement());
    }
}

async function getUsersFromRandomUserGeneratorAPI(userAmount) {
    try {
        const response = await fetch(`https://randomuser.me/api/?results=${userAmount}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Помилка при отриманні даних:', error);
        throw error;
    }
}

async function getUsers(userAmount) {
    try {
        const userData = await getUsersFromRandomUserGeneratorAPI(userAmount);
        const container = document.querySelector(".user_profiles_div");

        if (!container) {
            throw new Error('Контейнер для профілів користувачів не знайдено.');
        }

        userData.forEach(user => {
            const newUser = new User(
                user.picture.large,
                `${user.name.first} ${user.name.last}`,
                user.dob.age,
                user.phone,
                user.email,
                `${user.location.city}, ${user.location.country}`,
                user.registered.date // Поле registered з API
            );
            newUser.addToContainer(container);

            createOptionals();
        });
    } catch (error) {
        console.error('Помилка при обробці даних:', error);
    }
}

let isAppendingUsersAllowed = true;
const container = document.querySelector(".user_profiles_div");
getUsers(10);

container.addEventListener('scroll', async function() {
    if (isAppendingUsersAllowed && container.scrollHeight - container.scrollTop === container.clientHeight) {
        await getUsers(10);
        findUsers();
        getURLParameters();
    }
});

// PROFILE DROP DOWN MENU
//////////////////////////////////////////////////////////////////////////////////////////////////////

const userProfileDiv = document.querySelector(".user_profile");
const dropDownMenu = document.querySelector(".dropDownMenu");

window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        dropDownMenu.style.display = "none";
    }
});

userProfileDiv.addEventListener("click", (e) => {
    dropDownMenu.style.display = "flex";
    dropDownMenu.style.left = 1700 + "px";
    dropDownMenu.style.top = 100 + "px";
});

function wait(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(); // Викликаємо resolve після закінчення затримки
        }, delay);
    });
}

const logOutButton = document.querySelector(".logOutButton");
logOutButton.addEventListener('click', (e) => {
    logOutButton.style.backgroundColor = "slategray";
    localStorage.removeItem("userData");
    wait(1500).then(() => {
        window.location.replace("../Part_1/index.html");
    });
});

// SEARCHING
//////////////////////////////////////////////////////////////////////////////////////////////////////
const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("input", (e) => {
    findUsers();
});

function findUsers() {
    const inputValue = searchInput.value.toLowerCase().trim();
    setTimeout(() => { // Затримка виконання функції на 1 секунду
        User.allUsers.forEach(user => {
            const username = user.name.toLowerCase();
            if (username.includes(inputValue)) {
                user.element.style.display = "block"; // Встановлюємо стиль відображення для знайдених користувачів
            } else {
                user.element.style.display = "none"; // Ховаємо незнайдені користувачі
            }
        });
    }, 500); // 1000 мілісекунд = 1 секунда
}

// FILTERING
////////////////////////////////////////////////////////////////////////////////////////////////////////
let optionsArray = [];

let filterByAgeSelectElement = document.getElementById("filterByAgeSelectElementId");
let filterByNameSelectElement = document.getElementById("filterByNameSelectElementId");
let filterByLocationSelectElement = document.getElementById("filterByLocationSelectElementId");
let filterByEmailSelectElement = document.getElementById("filterByEmailSelectElementId");

function createFilterByOptional(selectElement, attribute, defaultOptionText) {
    selectElement.innerHTML = "";

    var defaultOption = document.createElement("option");
    defaultOption.textContent = defaultOptionText.toString(); // Текст дефолтної опції
    defaultOption.value = "All"; // Значення дефолтної опції, якщо потрібно
    defaultOption.selected = true; // Встановлюємо дефолтну опцію як обрану за замовчуванням
    selectElement.appendChild(defaultOption);

    optionsArray = collectData(attribute); // Змінено 'location' на рядок

    optionsArray.sort();

    optionsArray.forEach(function(optionText) {
        var option = document.createElement("option");
        option.text = optionText;
        selectElement.add(option);
    });
}

function collectData(attribute) {
    // Створюємо новий Set для зберігання унікальних даних
    const uniqueData = new Set();

    User.allUsers.forEach(user => {
        uniqueData.add(user[attribute]);
    });

    const dataArray = Array.from(uniqueData);

    return dataArray;
}

function createOptionals() {
    createFilterByOptional(filterByAgeSelectElement, "age", "All");
    createFilterByOptional(filterByNameSelectElement, "name", "All"); // Змінено "name" на "name.first"
    createFilterByOptional(filterByLocationSelectElement, "location", "All");
    createFilterByOptional(filterByEmailSelectElement, "email", "All");
}

// SORTING
///////////////////////////////////////////////////////////////////////////////////////////////////////////

const buttons = document.querySelectorAll(".buttonsDiv button");

buttons.forEach(button => {
    button.addEventListener("click", function (event) {
        const sortBy = button.getAttribute("data-sort-by");
        const sortingDirection = button.getAttribute("data-sort-direction");
        const sortedUsers = User.sortByField(sortBy, sortingDirection);

        container.innerHTML = "";

        sortedUsers.forEach(user => {
            user.addToContainer(container);
        });

        console.log(sortedUsers);
    });
});

// FILTERING
//////////////////////////////////////////////////////////////////////////////////////////////////////

const selectElements = document.querySelectorAll("select");
let filteredUsers = [];
let currentSelectedValue = "";
let isVariableAbleToChange = true;

selectElements.forEach(select => {
    select.addEventListener("change", function(event) {
        isVariableAbleToChange = true;

        if (isVariableAbleToChange) {
            currentSelectedValue = event.target.value;
            isVariableAbleToChange = false;
        }

        const selectedValue = event.target.value // Отримати вибране значення з селекта
        const filterBy = select.getAttribute("data-filter-by"); // Отримати атрибут data-filter-by
        console.log(selectedValue);

        filterUsers(filterBy, selectedValue);

        selectElements.forEach(select => {
            select.value = "All";
        });
        event.target.value = currentSelectedValue;
    });
});

function filterUsers(attribute, value) {
    filteredUsers = [];

    User.allUsers.forEach(user => {
        const userAttributeValue = user[attribute];

        if (userAttributeValue.toString() === value.toString() || value === "All") {
            filteredUsers.push(user);
        }
    });

    container.innerHTML = "";

    filteredUsers.forEach(user => {
        user.addToContainer(container);
    });
}

// URL UPDATING
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateURL() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams();

    selectElements.forEach(select => {
        const attributeName = select.getAttribute("data-filter-by");
        params.set(attributeName, select.value);
    });

    const sortByButton = document.querySelector(".buttonsDiv button.active");
    if (sortByButton) {
        params.set("sort-by", sortByButton.getAttribute("data-sort-by"));
        params.set("sort-direction", sortByButton.getAttribute("data-sort-direction"));
    }

    url.search = params.toString();
    window.history.replaceState({}, '', url);
}

function updateStateFromURL() {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    selectElements.forEach(select => {
        const attributeName = select.getAttribute("data-filter-by");
        const value = params.get(attributeName);
        if (value) {
            select.value = value;
        }
    });

    const sortBy = params.get("sort-by");
    const sortDirection = params.get("sort-direction");
    if (sortBy && sortDirection) {
        const sortByButton = document.querySelector(`.buttonsDiv button[data-sort-by="${sortBy}"][data-sort-direction="${sortDirection}"]`);
        if (sortByButton) {
            sortByButton.click(); // Симулюємо клік на кнопку сортування
        }
    }
}

selectElements.forEach(select => {
    select.addEventListener("change", function(event) {
        generateURL(); // Оновлюємо URL-адресу після зміни фільтрів
        filterUsers(select.getAttribute("data-filter-by"), event.target.value);
    });
});

buttons.forEach(button => {
    button.addEventListener("click", function(event) {
        const sortBy = button.getAttribute("data-sort-by");
        const sortDirection = button.getAttribute("data-sort-direction");
        const sortingDirection = button.classList.contains("active") ? (sortDirection === "asc" ? "desc" : "asc") : sortDirection;
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        generateURL(); // Оновлюємо URL-адресу після зміни сортування
        const sortedUsers = User.sortByField(sortBy, sortingDirection);
        container.innerHTML = "";
        sortedUsers.forEach(user => {
            user.addToContainer(container);
        });
    });
});

window.addEventListener('DOMContentLoaded', function() {
    updateStateFromURL();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getURLParameters() {
    const currentURL = window.location.href;

    const urlParams = new URLSearchParams(currentURL);

    const paramsObject = {};
    for (const [key, value] of urlParams.entries()) {
        paramsObject[key] = value;
    }

    console.log(paramsObject);
}