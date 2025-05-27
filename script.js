const usersContainer = document.querySelector("#users-container");
const btnCreate = document.querySelector("#btn-create");
const btnEdit = document.querySelector("#btn-edit");
const btnDelete = document.querySelector("#btn-delete");

const MOCK_API_URL = "https://68356401cd78db2058c13d2f.mockapi.io/users";

let users = [];

btnCreate.addEventListener("click", () => {
  createUserAsync();
});

btnEdit.addEventListener("click", () => {
  editUserAsync();
});

btnDelete.addEventListener("click", () => {
  deleteUserAsync();
});

// ------ Отрисовка пользователей -------
const renderUsers = () => {
  usersContainer.innerHTML = "";
  users.forEach((user) => {
    const userWrapper = document.createElement("section");
    const userName = document.createElement("h3");
    const userCity = document.createElement("p");
    const userAvatar = document.createElement("img");

    userName.textContent = `Name: ${user.name}`;
    userCity.textContent = `City: ${user.city}`;
    userAvatar.src = user.avatar;

    userWrapper.append(userName, userCity, userAvatar);
    usersContainer.append(userWrapper);
  });
};

// ----- Удаление пользователя ------
const deleteUserAsync = async () => {
  try {
    const ID = "5";

    const response = await fetch(`${MOCK_API_URL}/${ID}`, {
      method: "DELETE"
    });

    if (response.status === 404) {
        throw new Error(`id ${ID} не валидный`);
    }
    const deletedUser = await response.json();
    
    users.filter(users => users.id !== deletedUser.id);

    renderUsers();
    console.log("Пользователь успешно удален");
  } catch (error) {
    console.error("Ошибка при удалении пользователя", error.message);
  }
};

// ----- Изменение пользователя ------
const editUserAsync = async () => {
  try {
    const ID = "2";

    const response = await fetch(`${MOCK_API_URL}/${ID}`, {
      method: "PUT",
      body: JSON.stringify({
        name: "Nicolay",
        city: "Berlin",
        avatar:
          "https://avatars.mds.yandex.net/i?id=e82ebf9d874f937e7aebec1534e71137554a4786-9070589-images-thumbs&n=13",
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const editedUser = await response.json();
    users = users.map((user) => {
        if (user.id === editedUser.id) {
            return editedUser;
        }
        return user;
    });
    renderUsers();
    console.log("Пользователь успешно изменен");
  } catch (error) {
    console.error("Ошибка при изменении пользователя", error.message);
  }
};

// ----- Создание нового пользователя ------
const createUserAsync = async () => {
  try {
    const response = await fetch(MOCK_API_URL, {
      method: "POST",
      body: JSON.stringify({
        name: "Elena",
        city: "Kirishi",
        avatar:
          "https://avatars.mds.yandex.net/i?id=88172d375e4874360dd6f63b4b20ec757bfc8e3e-5246403-images-thumbs&n=13",
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const newCreatedUser = await response.json();
    users.unshift(newCreatedUser);
    renderUsers();
    console.log("Новый пользователь успешно создан");
  } catch (error) {
    console.error("Ошибка при создании нового пользователя", error.message);
  }
};

// ----- Получение всех пользователей ------
const getUserAsync = async () => {
  try {
    console.log("Начало процесса");

    const response = await fetch(MOCK_API_URL);
    users = await response.json();

    renderUsers();
  } catch (error) {
    console.error("Пойманная ошибка", error.message);
  } finally {
    console.log("Финиш процесса");
  }
};

getUserAsync();
