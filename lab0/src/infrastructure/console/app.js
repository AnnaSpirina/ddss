const readlineSync = require('readline-sync');
const Student = require('../../domain/entities/Student');
const StudentOrganization = require('../../domain/entities/StudentOrganization');
const Event = require('../../domain/entities/Event');
const NotificationService = require('../../domain/services/NotificationService');
const QRCodeService = require('../../domain/services/QRCodeService');
const StudentOrganizationAggregate = require('../../domain/aggregates/StudentOrganizationAggregate');
const { 
    isStudentExists, 
    isOrganizationExists, 
    isEventExists 
} = require('../../domain/utils/validators');

let students = [];
let organizations = [];
let events = [];

const notificationService = new NotificationService();
const qrCodeService = new QRCodeService();


//Регистрация студента
function registerStudent() {
    console.log('\n=== Регистрация студента ===');
    const id = students.length + 1;
    let firstName, lastName, middleName, email, group;

    //Имя
    while (true) {
        firstName = readlineSync.question('Введите имя: ');
        if (firstName) break;
        console.log('Ошибка: Имя не может быть пустым!');
    }

    //Фамилия
    while (true) {
        lastName = readlineSync.question('Введите фамилию: ');
        if (lastName) break;
        console.log('Ошибка: Фамилия не может быть пустой!');
    }

    //Отчество
    middleName = readlineSync.question('Введите отчество (необязательно): ');

    //Эл.почта
    while (true) {
        email = readlineSync.question('Введите корпоративную почту НИУ ВШЭ: ');
        if (!email) {
            console.log('Ошибка: Почта не может быть пустой!');
            continue;
        }
        if (!email.endsWith('@edu.hse.ru')) {
            console.log('Ошибка: Почта должна заканчиваться на @edu.hse.ru!');
            continue;
        }
        const emailExists = students.some(student => student.email === email);
        if (emailExists) {
            console.log('Ошибка: Студент с такой почтой уже зарегистрирован!');
            continue;
        }
        break;
    }

    //Уч.группа
    while (true) {
        group = readlineSync.question('Введите учебную группу: ');
        if (group) break;
        console.log('Ошибка: Учебная группа не может быть пустой!');
    }

    //Создание нового студента
    const student = new Student(id, firstName, lastName, middleName, email, group);
    students.push(student);

    console.log(`Студент ${firstName} ${lastName} успешно зарегистрирован!`);
    displayAllStudents();
}


//Вывод всех студентов
function displayAllStudents() {
    console.log('\n=== Список всех студентов ===');
    if (students.length === 0) {
        console.log('Студенты не найдены.');
        return;
    }
    students.forEach(student => {
        console.log(`ID: ${student.id}, ФИО: ${student.lastName} ${student.firstName} ${student.middleName}, Группа: ${student.group}, Почта: ${student.email}`);
    });
}


//Создание студорганизации
function createOrganization() {
    console.log('\n=== Создание студенческой организации ===');

    //Проверка, что есть хотя бы один студент
    if (students.length === 0) {
        console.log('Ошибка: Невозможно создать организацию, так как не зарегистрирован ни один студент!');
        return;
    }

    let name, description, leaderId;

    //Название организации
    while (true) {
        name = readlineSync.question('Введите название организации: ');
        if (name) break;
        console.log('Ошибка: Название организации не может быть пустым!');
    }

    //Описание работы
    while (true) {
        description = readlineSync.question('Введите описание организации: ');
        if (description) break;
        console.log('Ошибка: Описание организации не может быть пустым!');
    }

    //ID руководителя
    while (true) {
        leaderId = parseInt(readlineSync.question('Введите ID руководителя (студента): '), 10);
        if (isStudentExists(leaderId, students)) break;
        console.log('Ошибка: Студент с таким ID не найден! Выберите студента из списка.');
        displayAllStudents();
    }

    //Создание организации
    const id = organizations.length + 1;
    const organization = new StudentOrganization(id, name, description, leaderId);
    organizations.push(organization);

    console.log(`Организация "${name}" успешно создана!`);
    displayAllOrganizations();
}


//Вывод всех студорганизаций
function displayAllOrganizations() {
    console.log('\n=== Список всех студенческих организаций ===');
    if (organizations.length === 0) {
        console.log('Организации не найдены.');
        return;
    }
    organizations.forEach(org => {
        console.log(`ID: ${org.id}, Название: ${org.name}, Описание: ${org.description}, Руководитель: ${org.leaderId}`);
    });
}


//Подписка на организацию
function subscribeToOrganization() {
    console.log('\n=== Подписка на организацию ===');

    //Проверка, что есть хотя бы один студент
    if (students.length === 0) {
        console.log('Ошибка: Невозможно подписаться на организацию, так как не зарегистрирован ни один студент!');
        return;
    }

    //Проверка, что есть хотя бы одна организация
    if (organizations.length === 0) {
        console.log('Ошибка: Невозможно подписаться на организацию, так как не создано ни одной организации!');
        return;
    }

    let studentId, organizationId;

    //ID студента
    while (true) {
        studentId = parseInt(readlineSync.question('Введите ID студента: '), 10);
        if (isStudentExists(studentId, students)) break;
        console.log('Ошибка: Студент с таким ID не найден!');
        displayAllStudents();
    }

    //ID организации
    while (true) {
        organizationId = parseInt(readlineSync.question('Введите ID организации: '), 10);
        if (isOrganizationExists(organizationId, organizations)) break;
        console.log('Ошибка: Организация с таким ID не найдена!');
        displayAllOrganizations();
    }

    //Подписываем студента на организацию
    const student = students.find(s => s.id === studentId);
    const organization = organizations.find(o => o.id === organizationId);

    student.subscribeToOrganization(organizationId);
    console.log(`Студент ${student.firstName} ${student.lastName} успешно подписан на организацию "${organization.name}".`);
}


//Отписка от студорганизации
function unsubscribeFromOrganization() {
    console.log('\n=== Отписка от организации ===');

    //Проверка, что есть хотя бы один студент
    if (students.length === 0) {
        console.log('Ошибка: Невозможно отписаться от организации, так как не зарегистрирован ни один студент!');
        return;
    }

    //Проверка, что есть хотя бы одна организация
    if (organizations.length === 0) {
        console.log('Ошибка: Невозможно отписаться от организации, так как не создано ни одной организации!');
        return;
    }
    let studentId, organizationId;

    //ID студента
    while (true) {
        studentId = parseInt(readlineSync.question('Введите ID студента: '), 10);
        if (isStudentExists(studentId, students)) break;
        console.log('Ошибка: Студент с таким ID не найден!');
        displayAllStudents();
    }

    //ID организации
    while (true) {
        organizationId = parseInt(readlineSync.question('Введите ID организации: '), 10);
        if (isOrganizationExists(organizationId, organizations)) break;
        console.log('Ошибка: Организация с таким ID не найдена!');
        displayAllOrganizations();
    }

    //Находим студента и организацию
    const student = students.find(s => s.id === studentId);
    const organization = organizations.find(o => o.id === organizationId);

    //Проверяем, подписан ли студент на организацию
    if (!student.subscriptions.includes(organizationId)) {
        console.log(`Студент ${student.firstName} ${student.lastName} не подписан на организацию "${organization.name}".`);
        return;
    }

    //Отписываем студента от организации
    student.unsubscribeFromOrganization(organizationId);
    console.log(`Студент ${student.firstName} ${student.lastName} успешно отписан от организации "${organization.name}".`);
}


//Вывод студентов, подписанных на студорганизацию
function displaySubscribedStudents() {
    console.log('\n=== Список студентов, подписанных на организацию ===');

    //Проверка, что есть хотя бы один студент
    if (students.length === 0) {
        console.log('Ошибка: Невозможно отобразить список, так как не зарегистрирован ни один студент!');
        return;
    }

    //Проверка, что есть хотя бы одна организация
    if (organizations.length === 0) {
        console.log('Ошибка: Невозможно отобразить список, так как не создано ни одной организации!');
        return;
    }

    let organizationId;

    //ID организации
    while (true) {
        organizationId = parseInt(readlineSync.question('Введите ID организации: '), 10);
        if (isOrganizationExists(organizationId, organizations)) {
            const organization = organizations.find(o => o.id === organizationId);

            const subscribedStudents = students.filter(student => 
                student.subscriptions.includes(organizationId)
            );

            if (subscribedStudents.length === 0) {
                console.log(`На организацию "${organization.name}" пока никто не подписан.`);
                return;
            }

            //Выводим список подписанных студентов
            console.log(`Студенты, подписанные на организацию "${organization.name}":`);
            subscribedStudents.forEach(student => {
                console.log(`ID: ${student.id}, Имя: ${student.firstName} ${student.lastName}, Группа: ${student.group}, Почта: ${student.email}`);
            });
            return;
        }

        console.log('Ошибка: Организация с таким ID не найдена!');
        displayAllOrganizations();
    }
}


//Создание мероприятия
function createEvent() {
    console.log('\n=== Создание мероприятия ===');

    //Проверка, что есть хотя бы одна организация
    if (organizations.length === 0) {
        console.log('Ошибка: Невозможно создать мероприятие, так как не создано ни одной организации!');
        return;
    }

    let name, description, startDate, endDate, location, organizationId;

    //ID организации
    while (true) {
        organizationId = parseInt(readlineSync.question('Введите ID организации: '), 10);
        if (isOrganizationExists(organizationId, organizations)) break;
        console.log('Ошибка: Организация с таким ID не найдена!');
        displayAllOrganizations();
    }

    //Название мероприятия
    while (true) {
        name = readlineSync.question('Введите название мероприятия: ');
        if (name) break;
        console.log('Ошибка: Название мероприятия не может быть пустым!');
    }

    //Описание мероприятия
    while (true) {
        description = readlineSync.question('Введите описание мероприятия: ');
        if (description) break;
        console.log('Ошибка: Описание мероприятия не может быть пустым!');
    }

    //Дата начала мероприятия
    while (true) {
        startDate = readlineSync.question('Введите дату начала (ГГГГ-ММ-ДД): ');
        if (isValidDate(startDate)) break;
        console.log('Ошибка: Дата должна быть в формате ГГГГ-ММ-ДД!');
    }

    //Дата окончания мероприятия
    while (true) {
        endDate = readlineSync.question('Введите дату окончания (ГГГГ-ММ-ДД): ');
        if (!isValidDate(endDate)) {
            console.log('Ошибка: Дата должна быть в формате ГГГГ-ММ-ДД!');
            continue;
        }
        if (new Date(endDate) < new Date(startDate)) {
            console.log('Ошибка: Дата окончания мероприятия должна быть больше или равна дате начала!');
            continue;
        }
        break;
    }

    //Место проведения
    while (true) {
        location = readlineSync.question('Введите место проведения: ');
        if (location) break;
        console.log('Ошибка: Место проведения не может быть пустым!');
    }


    //Находим организацию и её руководителя
    const organization = organizations.find(org => org.id === organizationId);
    const leader = students.find(student => student.id === organization.leaderId);

    //Создаем агрегат для организации
    const organizationAggregate = new StudentOrganizationAggregate(organization, leader);

    //Генерация QR-кода для мероприятия
    const qrCode = qrCodeService.generateQRCode(events.length + 1, endDate);

    //Создаем мероприятие
    const event = new Event(events.length + 1, organizationId, name, description, startDate, endDate, location);
    event.qrCode = qrCode; //Сохраняем QR-код в мероприятии

    //Добавляем мероприятие через агрегат
    organizationAggregate.addEvent(event);

    //Сохраняем мероприятие в общий список мероприятий
    events.push(event);

    console.log(`Мероприятие "${name}" успешно создано!`);
    console.log(`QR-код для мероприятия: ${qrCode.value}`);
    console.log(`QR-код действителен до: ${qrCode.expirationDate}`);
}

//Функция для проверки формата даты (ГГГГ-ММ-ДД)
function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString);
    return !isNaN(date.getTime());
}


//Отмена мероприятия
function cancelEvent() {
    console.log('\n=== Отмена мероприятия ===');

    //Проверка, что есть хотя бы одно мероприятие
    if (events.length === 0) {
        console.log('Ошибка: Невозможно отменить мероприятие, так как не создано ни одного мероприятия!');
        return;
    }

    let eventId;

    //ID мероприятия
    while (true) {
        eventId = parseInt(readlineSync.question('Введите ID мероприятия: '), 10);
        if (isEventExists(eventId, events)) break;
        console.log('Ошибка: Мероприятие с таким ID не найдено!');
        displayAllEvents();
    }

    //Находим мероприятие
    const event = events.find(e => e.id === eventId);

    //Отменяем мероприятие
    event.cancel();

    //Отписываем всех зарегистрированных студентов от мероприятия
    event.registrations.forEach(studentId => {
        const student = students.find(s => s.id === studentId);
        if (student) {
            student.unregisterFromEvent(eventId);
        }
    });

    console.log(`Мероприятие "${event.name}" успешно отменено. Все зарегистрированные студенты отписаны.`);
}


//Вывод всех мероприятий
function displayAllEvents() {
    console.log('\n=== Список всех мероприятий ===');

    if (events.length === 0) {
        console.log('Мероприятия не найдены.');
        return;
    }

    events.forEach(event => {
        console.log(`ID: ${event.id}, Название: ${event.name}, Организация: ${event.organizationId}, Дата: ${event.startDate}, Место: ${event.location}, Статус: ${event.status}`);
    });
}

//Регистрация студента на мероприятие
function registerForEvent() {
    console.log('\n=== Регистрация на мероприятие ===');

    //Проверка, что есть хотя бы один студент
    if (students.length === 0) {
        console.log('Ошибка: Невозможно зарегистрироваться на мероприятие, так как не зарегистрирован ни один студент!');
        return;
    }

    //Проверка, что есть хотя бы одно мероприятие
    if (events.length === 0) {
        console.log('Ошибка: Невозможно зарегистрироваться на мероприятие, так как не создано ни одного мероприятия!');
        return;
    }

    let studentId, eventId;

    //ID студента
    while (true) {
        studentId = parseInt(readlineSync.question('Введите ID студента: '), 10);
        if (isStudentExists(studentId, students)) break;
        console.log('Ошибка: Студент с таким ID не найден!');
        displayAllStudents();
    }

    //ID мероприятия
    while (true) {
        eventId = parseInt(readlineSync.question('Введите ID мероприятия: '), 10);
        if (isEventExists(eventId, events)) break;
        console.log('Ошибка: Мероприятие с таким ID не найдено!');
        displayAllEvents();
    }

    //Находим студента и мероприятие
    const student = students.find(s => s.id === studentId);
    const event = events.find(e => e.id === eventId);

    //Проверяем, подписан ли студент на организацию, проводящую мероприятие
    if (!student.subscriptions.includes(event.organizationId)) {
        console.log('Ошибка: Студент не подписан на организацию, проводящую это мероприятие!');
        return;
    }

    //Регистрируем студента на мероприятие
    student.registerForEvent(eventId);
    event.registrations.push(studentId);

    console.log(`Студент ${student.firstName} ${student.lastName} успешно зарегистрирован на мероприятие "${event.name}"!`);

    // Отправляем уведомление о регистрации
    const notificationService = new NotificationService(students);
    notificationService.sendRegistrationNotification(studentId, event.name);
}


//Вывод зарегистрированных студентов на мероприятие
function displayRegisteredStudentsForEvent() {
    console.log('\n=== Список студентов, зарегистрированных на мероприятие ===');

    //Проверка, что есть хотя бы один студент
    if (students.length === 0) {
        console.log('Ошибка: Невозможно отобразить список, так как не зарегистрирован ни один студент!');
        return;
    }

    //Проверка, что есть хотя бы одно мероприятие
    if (events.length === 0) {
        console.log('Ошибка: Невозможно отобразить список, так как не создано ни одного мероприятия!');
        return;
    }

    let eventId;

    //ID мероприятия
    while (true) {
        eventId = parseInt(readlineSync.question('Введите ID мероприятия: '), 10);
        if (isEventExists(eventId, events)) break;
        console.log('Ошибка: Мероприятие с таким ID не найдено!');
        displayAllEvents();
    }

    //Находим мероприятие
    const event = events.find(e => e.id === eventId);

    //Проверяем, есть ли зарегистрированные студенты
    if (event.registrations.length === 0) {
        console.log(`На мероприятие "${event.name}" пока никто не зарегистрирован.`);
        return;
    }

    //Выводим список зарегистрированных студентов
    console.log(`Студенты, зарегистрированные на мероприятие "${event.name}":`);
    event.registrations.forEach(studentId => {
        const student = students.find(s => s.id === studentId);
        if (student) {
            console.log(`ID: ${student.id}, Имя: ${student.firstName} ${student.lastName}, Группа: ${student.group}, Почта: ${student.email}`);
        }
    });
}

function sendRemindersForEvents() {
    console.log('\n=== Отправка напоминаний о мероприятиях ===');

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    events.forEach(event => {
        const eventDate = new Date(event.startDate);
        if (eventDate.toDateString() === tomorrow.toDateString()) { //Если мероприятие завтра
            event.registrations.forEach(studentId => {
                //Отправляем напоминание каждому зарегистрированному студенту
                notificationService.sendReminderNotification(studentId, event.name, event.startDate);
            });
        }
    });
}

function mainMenu() {
    while (true) {
        console.log('\n=== Главное меню ===');
        console.log('1. Зарегистрировать студента');
        console.log('2. Показать всех студентов');
        console.log('3. Создать студенческую организацию');
        console.log('4. Показать все студенческие организации');
        console.log('5. Подписаться на организацию');
        console.log('6. Отписаться от организации');
        console.log('7. Показать студентов, подписанных на организацию');
        console.log('8. Создать мероприятие');
        console.log('9. Отменить мероприятие');
        console.log('10. Показать все мероприятия');
        console.log('11. Зарегистрировать студента на мероприятие');
        console.log('12. Показать зарегистрированных студентов на мероприятие');
        console.log('13. Выйти');

        const choice = readlineSync.question('Выберите действие: ');

        switch (choice) {
            case '1':
                registerStudent();
                break;
            case '2':
                displayAllStudents();
                break;
            case '3':
                createOrganization();
                break;
            case '4':
                displayAllOrganizations();
                break;
            case '5':
                subscribeToOrganization();
                break;
            case '6':
                unsubscribeFromOrganization();
                break;
            case '7':
                displaySubscribedStudents();
                break;
            case '8':
                createEvent();
                break;
            case '9':
                cancelEvent();
                break;
            case '10':
                displayAllEvents();
                break;
            case '11':
                registerForEvent();
                break;
            case '12':
                displayRegisteredStudentsForEvent();
                break;
            case '13':
                console.log('Выход из программы.');
                return;
            default:
                console.log('Неверный выбор! Попробуйте снова.');
        }
    }
}

mainMenu();