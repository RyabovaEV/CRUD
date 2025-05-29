const dataCreateUserForm = document.querySelector("[data-create-user-form]");
const usersContainer = document.querySelector("[data-users-container]");
const editUserFormDialog = document.querySelector("[data-edit-user-form-dialog]");

const MOCK_API_URL = "https://68356401cd78db2058c13d2f.mockapi.io/users";

let users = [];

usersContainer.addEventListener("click", (e) => {
  const removeBtn = e.target.closest("[data-user-remove-btn]");
  const editBtn = e.target.closest("[data-user-edit-btn]");
  
  if (removeBtn) {
    const userId = removeBtn.dataset.userId;
    const isRemoveUser = confirm("Вы точно хотите удалить этого пользователя?");
    isRemoveUser && removeExistingUserAsync(userId);
    return;
  }

  if (editBtn) {
    const userId = editBtn.dataset.userId;
    populateDialog(userId);
    editUserFormDialog.showModal();
    return;
  }
});

//------ Событие отправки формы создания пользователя -------
dataCreateUserForm.addEventListener("submit", (e) => {
    e.preventDefault(); //при отправке формы не сбрасываются поля формы
    const formData = new FormData(dataCreateUserForm);
    const formUserData = Object.fromEntries(formData);

    const newUserDate = {
      name: formUserData.userName,
      city: formUserData.userCity,
      email: formUserData.userEmail,
      avatar: formUserData.userImageUrl, 
    }
    
    createUserAsync(newUserDate);
})

// ------ Отрисовка пользователей -------
const renderUsers = () => {
  usersContainer.innerHTML = "";
  users.forEach((user) => {
    usersContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="user-card">
          <img src="${user.avatar}" alt="${user.name}">
          <div class="user-text">
            <h3>${user.name}</h3>
            <p>City: ${user.city}</p>
            <span>Email: ${user.email}</span>
          </div>
          <div class="user-actions">
            <button class="user-edit-btn" data-user-id="${user.id}" data-user-edit-btn>
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="user-remove-btn" data-user-id="${user.id}" data-user-remove-btn>
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      `
    );
  });
};

// ----- Удаление пользователя ------
const removeExistingUserAsync = async (userId) => {
  try {
    const response = await fetch(`${MOCK_API_URL}/${userId}`, {
      method: "DELETE",
    });

    if (response.status === 404) {
      throw new Error(`id ${userId} не валидный`);
    }
    const removedUser = await response.json();

    users = users.filter((users) => users.id !== removedUser.id);

    renderUsers();
    console.log("Пользователь успешно удален");
  } catch (error) {
    console.error("Ошибка при удалении пользователя", error.message);
  }
};

// ----- Изменение пользователя ------
const editExistingUserAsync = async (newUserData) => {
  try {
    const response = await fetch(`${MOCK_API_URL}/${newUserData.id}`, {
      method: "PUT",
      body: JSON.stringify(newUserData),
      headers: {
        "Content-type": "application/json",
      },
    });
    const editedUser = await response.json();
    
    users = users.map((user) => {
      if (user.id === editedUser.id) {
        return editedUser
      }
      return user;
    })

    editUserFormDialog.close();
    renderUsers();

    alert("Новый пользователь успешно изменен");
  } catch (error) {
    console.error("Ошибка при редактировании пользователя", error.message);
  }
}

// ----- Создание нового пользователя ------
const createUserAsync = async (newUserDate) => {
  try {
    const response = await fetch(MOCK_API_URL, {
      method: "POST",
      body: JSON.stringify(newUserDate),
      headers: {
        "Content-type": "application/json",
      },
    });
    const newCreatedUser = await response.json();
    users.unshift(newCreatedUser);
    renderUsers();
    dataCreateUserForm.reset();
    alert("Новый пользователь успешно создан");
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

//----- Модальное окно для редактирования -----
const populateDialog = (userId) => {
  editUserFormDialog.innerHTML = "";

  const editForm = document.createElement("form");
  const closeFormBtn = document.createElement("button");
  const faForBtn = document.createElement("i");
  faForBtn.classList.add("far", "fa-window-close")

  closeFormBtn.classList.add("close-modal-btn");
  closeFormBtn.append(faForBtn);
  closeFormBtn.addEventListener("click", () => editUserFormDialog.close());

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(editForm);
    const formUserData = Object.fromEntries(formData);

    const newUserData = {
      id: formUserData.userId,
      name: formUserData.userName,
      city: formUserData.userCity,
      email: formUserData.userEmail,
      avatar: formUserData.userImageUrl, 
    }

    editExistingUserAsync(newUserData);
  })

  editForm.classList.add("form");
  editForm.innerHTML = `
            <input type="text" name="userId" value="${userId}" hidden/>
            <div class="control-field">
              <label for="nameId" class="form-label">Name</label>
              <input
                type="text"
                class="form-control"
                id="nameId"
                name="userName"
                required
                minlength="2"
                maxlength="23"
              />
            </div>
            <div class="control-field">
              <label for="cityId" class="form-label">City</label>
              <input
                type="text"
                class="form-control"
                id="cityId"
                name="userCity"
                required
                minlength="2"
                maxlength="20"
              />
            </div>
            <div class="control-field">
              <label for="emailId" class="form-label">Email</label>
              <input
                type="email"
                class="form-control form-control--email"
                id="emailId"
                name="userEmail"
                required
              />
            </div>
            <div class="control-field">
              <label for="imagesUrlId" class="form-label">Images</label>
              <select
                name="userImageUrl"
                id="imagesUrlId"
                class="form-control form-control--images"
                required
              >
                <option value="">Image URL</option>
                <hr />
                <option
                  value="https://avatars.mds.yandex.net/i?id=02c22ebe6cc9a553e226e5a5fac18181cbd5e254-5888781-images-thumbs&n=13"
                >
                  img 1
                </option>
                <option
                  value="https://avatars.mds.yandex.net/i?id=033474d243d690a0c24d1ef798971e1217d6e3a26e6383cf-5267851-images-thumbs&n=13"
                >
                  img 2
                </option>
                <option
                  value="https://avatars.mds.yandex.net/i?id=0d7fefc4819c3ad1781c73d1a79046ea6ecf1bcd-4168527-images-thumbs&n=13"
                >
                  img 3
                </option>
                <option
                  value="https://avatars.mds.yandex.net/i?id=75481c4eb6efe7d9564db7759915a9c7c5a94a71-10397524-images-thumbs&n=13"
                >
                  img 4
                </option>
              </select>
            </div>
            <button type="submit" class="btn submit-btn">Edit User</button>
  `

  editUserFormDialog.append(editForm, closeFormBtn);

}

getUserAsync();
