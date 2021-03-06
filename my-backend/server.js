const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const accessTokenSecret = 'youraccesstokensecret';

const adminUserType = 0;
const studentUserType = 1;
const organizationUserType = 2;

let originsWhitelist = ['http://localhost:4200'];
let corsOptions = {
    origin: function (origin, callback) {
        let isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    }
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

let connectionInfo = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'diplom',
    port: '3306',
    connectionLimit: 5
};

const pool = mysql.createPool(connectionInfo);

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'diplom'
});

connection.connect(function (err) {
    // in case of error
    if (err) {
        console.log(err.code);
        console.log(err.fatal);
    }
});


function getTableNameByRole(role) { //функция для возвращения таблицы по роли пользователя
    switch (role) {
        case adminUserType:
            return "admin";
        case studentUserType:
            return "student";
        case organizationUserType:
            return "organization";
    }
}

//регистрация администратора
app.post("/signup/admin", (request, response) => {

    let email = request.body.email;
    let password = request.body.password;
    let name = request.body.name;

    let insertAdminSQLQuery = "insert into admin (name) values (?)";
    let insertAdminSQLParameters = [name];

    pool.query(insertAdminSQLQuery, insertAdminSQLParameters, (insertAdminError, insertAdminResult) => {
        
        if (insertAdminError) {
            console.error("Не удалось сохранить админа.", insertAdminError);
            return response.sendStatus(500);
        }

        console.info(`Удачное сохранение администратора с id: ${insertAdminResult.insertId}`);

        let insertUserSQLQuery = "insert into users (email, password, role, referenceId) values (?, ?, ?, ?)";
        let insertUserSQLParameters = [email, password, adminUserType, insertAdminResult.insertId];

        pool.query(insertUserSQLQuery, insertUserSQLParameters, (insertUserError, insertUserResult) => {

            if (insertUserError) {
                console.error("Не удалось сохранить пользователя.", insertUserError);
                return response.sendStatus(500);
            }

            console.info(`Удачное сохранение пользователя с id: ${insertUserResult.insertId}`);

            let accessToken = jwt.sign({ 
                userId: insertUserResult.insertId, 
                role: adminUserType, 
                referenceId: insertAdminResult.insertId 
            }, accessTokenSecret);

            let userData = { // Здесь лежат все публичные данные об админе, которые нужно вернуть пользователю
                id: insertAdminResult.insertId,
                name: name
            }

            return response.json({
                accessToken: accessToken,
                userData: userData
            });
        });
    });
});

//регистрация студента
app.post("/signup/student", (request, response) => {

    let email = request.body.email;
    let password = request.body.password;
    let fio = request.body.fio;
    let faculty = request.body.faculty;
    let groupNumber = request.body.group;
    let tel = request.body.tel;
    let portfolio = request.body.portfolio;
    let contacts = request.body.contacts;

    let insertStudentSQLQuery = "insert into student (fio, faculty, groupNumber, tel, portfolio, contacts) values (?,?,?,?,?,?)";
    let insertStudentSQLParameters = [fio, faculty, groupNumber, tel, portfolio, contacts];

    pool.query(insertStudentSQLQuery, insertStudentSQLParameters, (insertStudentError, insertStudentResult) => {
        
        if (insertStudentError) {
            console.log("Не удалось сохранить студента.", insertStudentError);
            return response.sendStatus(500);

        }

        console.info(`Удачное сохранение студента с id: ${insertStudentResult.insertId}`);

        let insertUserSQLQuery = "insert into users (email, password, role, referenceId) values (?, ?, ?, ?)";
        let insertUserSQLParameters = [email, password, studentUserType, insertStudentResult.insertId];

        pool.query(insertUserSQLQuery, insertUserSQLParameters, (insertUserError, insertUserResult) => {

            if (insertUserError) {
                console.log("Не удалось сохранить пользователя.", insertUserError);
                return response.sendStatus(500);
            }

            console.info(`Удачное сохранение пользователя с id: ${insertUserResult.insertId}`);

            let accessToken = jwt.sign({ 
                userId: insertUserResult.insertId, 
                role: studentUserType, 
                referenceId: insertStudentResult.insertId 
            }, accessTokenSecret);

            let userData = { // Здесь лежат все публичные данные о студенте, которые нужно вернуть пользователю
                id: insertStudentResult.insertId,
                fio: fio,
                faculty: faculty,
                groupNumber: groupNumber,
                tel: tel,
                portfolio: portfolio,
                contacts: contacts
            }

            return response.json({
                accessToken: accessToken,
                userData: userData
            });
        });
    });
});

//регистрация организации
app.post("/signup/organization", (request, response) => {

    let email = request.body.email;
    let password = request.body.password;
    let name = request.body.name;
    let description = request.body.description;
    let address = request.body.address;
    let tel = request.body.tel;

    let insertOrganizationSQLQuery = "insert into organization (name, description, address, tel) values (?,?,?,?)";
    let insertOrganizationSQLParameters = [name, description, address, tel];

    pool.query(insertOrganizationSQLQuery, insertOrganizationSQLParameters, (insertOrganizationError, insertOrganizationResult) => {
        
        if (insertOrganizationError) {
            console.error("Не удалось сохранить организацию.", insertOrganizationError);
            return response.sendStatus(500);
        }

        console.info(`Удачное сохранение организации с id: ${insertOrganizationResult.insertId}`);

        let insertUserSQLQuery = "insert into users (email, password, role, referenceId) values (?, ?, ?, ?)";
        let insertUserSQLParameters = [email, password, organizationUserType, insertOrganizationResult.insertId];

        pool.query(insertUserSQLQuery, insertUserSQLParameters, (insertUserError, insertUserResult) => {

            if (insertUserError) {
                console.error("Не удалось сохранить пользователя.", insertUserError);
                return response.sendStatus(500);
            }

            console.info(`Удачное сохранение пользователя с id: ${insertUserResult.insertId}`);

            let accessToken = jwt.sign({ 
                userId: insertUserResult.insertId, 
                role: organizationUserType, 
                referenceId: insertOrganizationResult.insertId 
            }, accessTokenSecret);

            let userData = { // Здесь лежат все публичные данные об организации, которые нужно вернуть пользователю
                id: insertOrganizationResult.insertId,
                name: name,
                description: description,
                address: address,
                tel: tel
            }

            return response.json({
                accessToken: accessToken,
                userData: userData
            });
        });
    });
});


app.post("/login", (request, response) => {

    let email = request.body.email;
    let password = request.body.password;

    let selectUserQuery = 'SELECT * FROM users WHERE email="' + email + '" AND password="' + password + '"';

    pool.query(selectUserQuery, (selectUserError, selectUserResult) => {

        if (selectUserError) {
            console.log("Возникла ошибка при поиске пользователя.", selectUserError);
            return response.sendStatus(500);
        }

        console.info(`Найден пользователь: ${JSON.stringify(selectUserResult)}`);
        
        let selectedUser = selectUserResult[0];

        if (!selectedUser) {
            console.log("Возникла ошибка при поиске пользователя под индексом 0");
            return response.sendStatus(404);
        }

        let selectReferenceUserSQLQuery = `select * from ${getTableNameByRole(selectedUser.role)} where id=${selectedUser.referenceId}`;
        console.log(selectReferenceUserSQLQuery);

        pool.query(selectReferenceUserSQLQuery, (selectReferenceUserError, selectReferenceUserResult) => {

            if (selectReferenceUserError) {
                console.log("Возникла ошибка при поиске ссылочного пользователя.", selectReferenceUserError);
                return response.sendStatus(500);
            }

            console.info(`Найден ссылочный пользователь: ${JSON.stringify(selectReferenceUserResult)}`);

            let accessToken = jwt.sign({ 
                userId: selectedUser.id, 
                role: selectedUser.role, 
                referenceId: selectedUser.referenceId 
            }, accessTokenSecret);


            return response.json({
                accessToken: accessToken,
                role: selectedUser.role
            });
        });
    });
});

const checkAuthorizationMiddleware = (request, response, next) => { // функция для проверки каждого авторизованного пользователя
    let accessToken = request.headers.authorization;

    if (accessToken) {
        console.log("Полученный jsonwebtoken", accessToken);

        jwt.verify(accessToken, accessTokenSecret, (error, jwtData) => { // проверка на валидность токена
            if (error) {
                console.error("Не удалось распарсить JWT.", JSON.stringify(error));
                return response.sendStatus(403);
            }
            console.log(`Присланные данные из jwt: ${JSON.stringify(jwtData)}`);

            let jwtDataDecoded = jwt.decode(accessToken);

            console.log(`Декодированные данные из jwt: ${JSON.stringify(jwtDataDecoded)}`);
            request.jwtData = jwtData; //для запроса!!!!!!!
            next();
        });

    } else {
        return response.sendStatus(401);
    }
    
};

// const checkStudentOnlyMiddleware = (request, response, next) => { // функция для проверки только студента
//     let jwtData = request.jwtData;

//     if (jwtData) {
//         console.error("Этот middleware должен быть в связке после провкерки на авторизацию");
//         return response.sendStatus(401);
//     }

//     if (jwtData.role == studentUserType) {
//         next();
//     } else {
//         console.error("Доступ к этому руту есть только у пользователей с ролью 'Студент'");
//         return response.sendStatus(403);
//     }
// };

const checkRoleMiddleware = function(roles) { //функция для проверки доступа нескольких ролей
    return (request, response, next) => {
        let jwtData = request.jwtData;

        if (jwtData) {
            console.error("Этот middleware должен быть в связке после провкерки на авторизацию");
            return response.sendStatus(401);
        }

        if (roles.includes(jwtData.role)) {
            next();
        } else {
            console.error(`Доступ к этому руту есть только у пользователей с ролями ${roles}`);
            return response.sendStatus(403);
        }
    }
}

app.get("/self", checkAuthorizationMiddleware, (request, response) => {
    let jwtData = request.jwtData;

    console.log(`Данные внутри jwt: ${JSON.stringify(jwtData)}`);

    let selectReferenceUserSQLQuery = `select * from ${getTableNameByRole(jwtData.role)} where id=${jwtData.referenceId}`;

    pool.query(selectReferenceUserSQLQuery, (error, data) => {

        if (error) {
            console.error(`Не удалось найти ссылочного пользователя по id: ${jwtData.id}.`, JSON.stringify(error));
            return response.sendStatus(500);
        }
        
        let user = data[0];

        if (user) {
            console.info(`Найден ссылочный пользователь с id: ${user.id}`);
        } else {
            console.error("Пользователь найден, но в массиве результата его нет");
            return response.sendStatus(404);
        }

        return response.json({
            userMetadata: {
                id: jwtData.id,
                role: jwtData.role
            },
            userData: user
        });
    });
});

app.post("apply-ticket", checkAuthorizationMiddleware, checkRoleMiddleware([studentUserType]), (request, response) => {

});

app.get("/admin_profile", function (req, res) {
    pool.query("SELECT * FROM organization", function (err, data) {
        if (err) return console.log(err);

        console.log(data);
        res.json(data);
    });
});

//получить профиль организации, просто для просмотра
app.get("/organization/:id", function (req, res) {

    const id = req.params.id;

    pool.query("SELECT * FROM organization WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);

        let user = data[0];

        if (user) {
            console.info(`Найден ссылочный пользователь с id: ${user.id}`);
        } else {
            console.error("Пользователь найден, но в массиве результата его нет");
            return response.sendStatus(404);
        }

        return res.json({
            userData: user
        });
    });
});

//получить профиль студента, просто для просмотра
app.get("/student/:id", function (req, res) {

    const id = req.params.id;

    pool.query("SELECT * FROM student WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);

        let user = data[0];

        if (user) {
            console.info(`Найден ссылочный пользователь с id: ${user.id}`);
        } else {
            console.error("Пользователь найден, но в массиве результата его нет");
            return response.sendStatus(404);
        }

        return res.json({
            userData: user
        });
    });
});

//редактировать профиль студента
app.post("/edit_student/:id", function (req, res) {

    let fio = req.body.fio;
    let faculty = req.body.faculty;
    let groupNumber = req.body.groupNumber;
    let tel = req.body.tel;
    let portfolio = req.body.portfolio;
    let contacts = req.body.contacts;
    const id = req.params.id;

    pool.query("UPDATE student SET fio=?, faculty=?, groupNumber=?, tel=?, portfolio=?, contacts=? WHERE id=?", [fio, faculty, groupNumber, tel, portfolio, contacts, id], function (err, data) {
        if (err) return console.log(err);

        res.json(data);
    });
});

// удалить профиль студента
app.delete("/delete_student/:id", function (req, res) {

    const id = req.params.id;
    let deleteUserQuery = 'DELETE FROM users WHERE referenceId="' + id + '" AND role="' + studentUserType + '"';
   

    pool.query("DELETE FROM student WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);

        console.log(data);
        res.json(data);
    });

    pool.query(deleteUserQuery, function (err, data) {
        if (err) return console.log(err);

        console.log(data);
        res.json(data);
    });

});

//отправить заявку на задачу в роли студента
app.post("/send_requestion", checkAuthorizationMiddleware, function (req, res) {

    let studentId = req.jwtData.referenceId;
    let taskId = req.body.id;
    let stateId = 1;

    pool.query(`SELECT organizationId from task WHERE id=${taskId}`,  function (errorIdData, orgIdData) {

    if (errorIdData) return console.log(errorIdData);
    console.log(orgIdData);
    let organizationId = orgIdData[0].organizationId;
    console.log(organizationId);

    pool.query("INSERT INTO ticket (studentId, taskId, stateId, organizationId) VALUES (?,?,?,?)", [studentId, taskId, stateId, organizationId], function (err, data) {
        if (err) return console.log(err);

        res.json(data);
        });
    });
});

//получить заявки в роли студента
app.get("/student_requestions/:id", function (req, res) {

    const studentId = req.params.id;

    let getRequestionsQuery = `SELECT * FROM ticket WHERE studentId = "${studentId}"`;


    pool.query(getRequestionsQuery, function (err, ticketData) {
  
        if (err) return console.log(err);
        res.json(ticketData);

    });
});

//отправить отзыв в роли студента
app.post("/student_feedback", checkAuthorizationMiddleware, function (req, res) {

    let studentUserId = req.jwtData.userId;
    let organizationId = req.body.id;
    let mark = req.body.mark;
    let text = req.body.text;

    let organizationUserIdQuery = `SELECT id from users WHERE referenceId="${organizationId}" AND role="${organizationUserType}" `; 
    let studentFeedbackQuery = 'INSERT INTO review (senderUserId, receiverUserId, mark, text) values (?,?,?,?)';
    
    pool.query(organizationUserIdQuery, function (userIdError, userIdData) {

        let organizationUserId = userIdData[0].id;

    pool.query(studentFeedbackQuery, [studentUserId, organizationUserId, mark, text], function (err, data) {
        if (err) return console.log(err);

        res.json(data);
        });
    });
});

// получить отзывы для студента
app.get("/student_feedback_list/:id",  function (req, res) {

    let studentId = req.params.id;

    let getUserIdQuery = `SELECT id from users WHERE referenceId="${studentId}" AND role="${studentUserType}" `;

    pool.query(getUserIdQuery, function (err, userIdData) {

    let studentUserId = userIdData[0].id;
    let getReviewQuery = `SELECT mark, text, isCompleted from review WHERE receiverUserId="${studentUserId}"`;

        pool.query(getReviewQuery, function (err, data) {

            res.json(data);
        });
    });
});

//удалить заявку в роли студента
app.delete("/delete_requestion/:id", function (req, res) {

    const id = req.params.id;

    pool.query("DELETE FROM ticket WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);

        console.log(data);
        res.json(data);
    });
});

//добавить умения для студента
app.post("/add_skills", function (req, res) {

    let studentId = req.body.studentId;
    let firstSkill = req.body.firstSkill; 
    let secondSkill = req.body.secondSkill;
    let thirdSkill = req.body.thirdSkill;
    let fourthSkill = req.body.fourthSkill;
    let fifthSkill = req.body.fifthSkill;
    let sixthSkill = req.body.sixthSkill;
    let seventhSkill = req.body.seventhSkill;

    let addSkillsQuery = "INSERT INTO skill (studentId, firstSkill, secondSkill, thirdSkill, fourthSkill, fifthSkill, sixthSkill, seventhSkill) VALUES(?,?,?,?,?,?,?,?)";

    pool.query(addSkillsQuery, [studentId, firstSkill, secondSkill, thirdSkill, fourthSkill, fifthSkill, sixthSkill, seventhSkill], function (err, data) {
        if (err) return console.log(err);

        res.json(data);
    });
});

//получить умения студента
app.get("/get_skills/:id", function (req, res) {

    const studentId = req.params.id;

    pool.query("SELECT * FROM skill WHERE studentId =?", [studentId], function (err, data) {
        if (err) return console.log(err);

        console.log(data);
        res.json(data);
    });
});

//редактировать профиль организации
app.post("/edit_organization/:id", function (req, res) {

    let name = req.body.name;
    let description = req.body.description;
    let address = req.body.address;
    let tel = req.body.tel;
    const id = req.params.id;

    pool.query("UPDATE organization SET name=?, description=?, address=?, tel=? WHERE id=?", [name, description, address, tel, id], function (err, data) {
        if (err) return console.log(err);

        res.json(data);
    });
});

//удалить профиль организации
app.delete("/delete_organization/:id", function (req, res) {

    const id = req.params.id;
    let deleteUserQuery = 'DELETE FROM users WHERE referenceId="' + id + '" AND role="' + organizationUserType + '"';
   

    pool.query("DELETE FROM student WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);

        console.log(data);
        res.json(data);
    });

    pool.query(deleteUserQuery, function (err, data) {
        if (err) return console.log(err);

        console.log(data);
        res.json(data);
    });

});

//создать новую задачу в роли организации
app.post("/create_task", function (req, res) {

    let description = req.body.description;
    let skills = req.body.skills;
    let type = req.body.type;
    let maxAmount = req.body.maxAmount;
    const organizationId = req.body.organizationId;

    pool.query("INSERT INTO task (type, organizationId, description, skills, maxAmount) values (?, ?, ?, ?, ?)", [type, organizationId, description, skills, maxAmount], function (err, data) {
        if (err) return console.log(err);

        res.json(data);
    });
});

//получить все задачи для организации
app.get("/get_tasks/:id", function (req, res) {

    const organizationId = req.params.id;

    pool.query("SELECT * FROM task WHERE organizationId =?", [organizationId], function (err, data) {
        if (err) return console.log(err);

        console.log(data);
        res.json(data);
    });
});

// удалить задачу в роли организации
app.delete("/delete_task/:id", function (req, res) {

    const id = req.params.id;

    pool.query("DELETE FROM task WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);

        console.log(data);
        res.json(data);
    });
});

//получить задачу в роли организации перед редактированием
app.get("/get_task/:id", function (req, res) {

    const id = req.params.id;

    pool.query("SELECT * from task WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);

        res.json(data);
    });
});

//редактировать задачу в роли организации
app.post("/edit_task/:id", function (req, res) {

    let description = req.body.description;
    let skills = req.body.skills;
    let type = req.body.type;
    let maxAmount = req.body.maxAmount;
    const id = req.params.id;

    pool.query("UPDATE task SET description=?, skills=?, type=?, maxAmount=? WHERE id=?", [description, skills, type, maxAmount, id], function (err, data) {
        if (err) return console.log(err);

        res.json(data);
    });
});

//получить новые заявки в роли организации
app.get("/get_requestions/:id", function (req, res) {

    const organizationId = req.params.id;
    let stateId = 1;
    let getNewRequestionsQuery = `SELECT * FROM ticket WHERE organizationId = "${organizationId}" AND stateId = "${stateId}"`;


    pool.query(getNewRequestionsQuery, function (err, ticketData) {
  
        if (err) return console.log(err);
        res.json(ticketData);

    });
});

//получить заявки с принятым решением в роли организации
app.get("/get_resolved_requestions/:id", function (req, res) {

    const organizationId = req.params.id;
    let stateId = 1;
    let getRequestionsQuery = `SELECT * FROM ticket WHERE NOT stateId = "${stateId}" AND organizationId = "${organizationId}"`;


    pool.query(getRequestionsQuery, function (err, ticketData) {
  
        if (err) return console.log(err);
        res.json(ticketData);

    });
});


//принять заявку в роли организации
app.post("/accept_requestion", function (req, res) {

    const id = req.body.id;
    let stateId = 3;

    pool.query("UPDATE ticket SET stateId=? WHERE id=?", [stateId, id], function (err, data) {
        if (err) return console.log(err);

        res.json(data);
    });
});

//отклонить заявку в роли организации
app.post("/reject_requestion", function (req, res) {

    const id = req.body.id;
    let stateId = 2;

    pool.query("UPDATE ticket SET stateId=? WHERE id=?", [stateId, id], function (err, data) {
        if (err) return console.log(err);

        res.json(data);
    });
});

//отправить отзыв в роли организации
app.post("/organization_feedback", checkAuthorizationMiddleware, function (req, res) {

    let organizationUserId = req.jwtData.userId;
    let studentId = req.body.id;
    let mark = req.body.mark;
    let text = req.body.text;
    let isCompleted = req.body.isCompleted;

    let studentUserIdQuery = `SELECT id from users WHERE referenceId="${studentId}" AND role="${studentUserType}" `; 
    let organizationFeedbackQuery = 'INSERT INTO review (senderUserId, receiverUserId, mark, text, isCompleted) values (?,?,?,?,?)';
    
    pool.query(studentUserIdQuery, function (userIdError, userIdData) {

        let studentUserId = userIdData[0].id;

    pool.query(organizationFeedbackQuery, [organizationUserId, studentUserId, mark, text, isCompleted], function (err, data) {
        if (err) return console.log(err);

        res.json(data);
        });
    });
});

// получить отзывы для организации
app.get("/organization_feedback_list/:id",  function (req, res) {

    let organizationId = req.params.id;

    let getUserIdQuery = `SELECT id from users WHERE referenceId="${organizationId}" AND role="${organizationUserType}" `;

    pool.query(getUserIdQuery, function (err, userIdData) {

    let organizationUserId = userIdData[0].id;
    let getReviewQuery = `SELECT mark, text from review WHERE receiverUserId="${organizationUserId}"`;

        pool.query(getReviewQuery, function (err, data) {

            res.json(data);
        });
    });
});


// получить список всех организаций
app.get("/organization_list", function (req, res) {
    pool.query("SELECT * FROM organization", function (err, data) {
        if (err) return console.log(err);

        console.log(data);
        res.json(data);
    });
});

// получить список всех студентов
app.get("/student_list", function (req, res) {
    pool.query("SELECT * FROM student", function (err, data) {
        if (err) return console.log(err);

        console.log(data);
        res.json(data);
    });
});

// получить количество записей для счетчика
app.get("/counter", function (req, res) {
    pool.query("SELECT COUNT(*) as count FROM users", function (err, data) {
        if (err) return console.log(err);
        console.log(data[0].count);
        res.json(data[0].count);
    });
});

// получить список задач от организации
app.get("/organization_profile/:id/tasks", function (req, res) {
    const id = req.body.id;

    pool.query("SELECT * FROM task WHERE organizationId =?", [id], function (err, data) {
        if (err) return console.log(err);

        console.log(data);
        res.json(data);
    });
});

// получить все задачи для администратора
app.get("/admin_tasks", function (req, res) {
    pool.query("SELECT * FROM task", function (err, data) {
        if (err) return console.log(err);

        console.log(data);
        res.json(data);
    });
});

// получить все отзывы для администратора
app.get("/admin_feedback", function (req, res) {
    pool.query("SELECT * FROM review", function (err, data) {
        if (err) return console.log(err);

        console.log(data);
        res.json(data);
    });
});

// удалить отзыв в роли администратора
app.delete("/admin_feedback/:id", function (req, res) {

    const id = req.params.id;

    pool.query("DELETE FROM review WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);

        console.log(data);
        res.json(data);
    });
});

// удалить задачу в роли администратора
app.delete("/admin_tasks/:id", function (req, res) {
    const id = req.params.id;

    pool.query("DELETE FROM task WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);

        console.log(data);
        res.json(data);
    });
});

// получить задачу, перед тем, как редактировать в роли администратора
// app.get("/admin_tasks/:id", function (req, res) {

//     const id = req.params.id;

//     pool.query("SELECT * from tasks WHERE id=?", [id], function (err, data) {
//         if (err) return console.log(err);

//         res.json(data);
//     });
// });

//  редактировать задачу в роли администратора
// app.post("/admin_tasks/:id", function (req, res) {

//     let description = req.body.description;
//     let skills = req.body.address;
//     let type = req.body.type;
//     let maxAmount = req.body.maxAmount;
//     const id = req.body.id;

//     pool.query("UPDATE task SET description=?, skills=?, type=?, maxAmount=?  WHERE id=?", [description, skills, type, maxAmount, id], function (err, data) {
//         if (err) return console.log(err);

//         res.json(data);
//     });
// });

// удалить отзыв в роли администратора
app.delete("/admin_feedback/:id", function (req, res) {

    const id = req.params.id;

    pool.query("DELETE FROM review WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);

        console.log(data);
        res.json(data);
    });
});


app.listen(port, function () {
    console.log(`server started at ${port}`);
});

// Close the connection
connection.end(function () {
    // The connection has been closed
});