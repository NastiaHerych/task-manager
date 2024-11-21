# TaskManager
Кроки для запуску проєкту
1. Клонування репозиторію
Клонуйте репозиторій за допомогою Git:
git clone https://github.com/NastiaHerych/task-manager.git
cd task-manager
2. Налаштування MongoDB Atlas
    1.	Створіть MongoDB кластер:
        o	Перейдіть на MongoDB Atlas і створіть акаунт (якщо ще не маєте).
        o	Створіть кластер в Atlas (можете вибрати безкоштовний план).
    2.	Створіть базу даних і колекції:
        o	Після створення кластера створіть нову базу даних, наприклад, task-manager-db.
    3.	Отримання URL підключення:
        o	Після налаштування кластера натисніть на "Connect" і виберіть "Connect your application".
        o	Скопіюйте URL для підключення до вашого MongoDB кластера.
    4.	Налаштування підключення в Node.js:
        o	У кореневій директорії вашого проєкту перейдіть у файл backend – config – db.js.
        o	Додайте змінну середовища для MongoDB підключення:
        const uri = mongodb+srv://<username>:<password>@cluster0.mongodb.net/task-manager-db?retryWrites=true&w=majority
        Замініть <username> та <password> на ваші дані доступу до MongoDB Atlas.
3. Налаштування Node.js (Backend)
    1.	Встановіть залежності для бекенду:
    cd backend
    npm install
    2.	Запустіть сервер:
    node server
    Сервер буде доступний за адресою http://localhost:3000.
4. Налаштування Angular (Frontend)
    1.	Перейдіть у папку з front-end частиною:
    cd src
    2.	Встановіть залежності для front-end частини:
    npm install
    3.	Запустіть Angular додаток:
    npm start
    Front-end частина буде доступна за адресою http://localhost:4200.
