const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();

// let allRoles =['Sales Lead', 'Salesperson', 'Engineering Manager', 'Software Engineer', 'Account Manager',
// 'Accountant', 'HR Manager', 'HR Specialist'];
let allRoles =[];
let allDepts = [];
let allEmployees = [];
let employeeNames = [];
let menuSelection;

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

const mainMenu = () => {
    inquirer.prompt (
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 
            'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
        }
    )
    .then((data) => {
        menuSelection = data.menu;
        if (data.menu === 'View All Departments') {
            viewDepartments();
        } else if(data.menu === 'View All Roles') {
            viewRoles();
        } else if (data.menu === 'View All Employees') {
            viewEmployees();
        } else if (data.menu === 'Add Employee') {
            rolesQuery();
        } else if (data.menu === 'Update Employee Role') {
            rolesQuery();
        } else if (data.menu === 'Add Department') {
            addDept();
        } else if (data.menu === 'Add Role') {
            deptQuery();
        } else if (data.menu === 'Quit') {
            console.log('\nGoodbye\n');
            db.end();
        }
    })
}

const viewDepartments = () => {
    db.query('SELECT * FROM departments', function (err, results) {
        console.table('\n',results);
        mainMenu()
      });
}

const viewRoles = () => {
    db.query(`SELECT employee_role.id, employee_role.title ,departments.dept_name, employee_role.salary
        FROM departments
        JOIN employee_role ON employee_role.department_id=departments.id`, function (err, results) {
            console.table('\n',results);
            mainMenu()
        });
}

const viewEmployees = () => {
    db.query(`SELECT employees.id, employees.first_name, employees.last_name, employee_role.title, departments.dept_name AS department, employee_role.salary, employees.manager_id AS manager
        FROM employees
        JOIN employee_role ON employee_role.id=employees.role_id
        JOIN departments ON departments.id=employee_role.department_id`, function(err, results) {
            for(let i = 0; i < results.length; i++) {
                if(results[i].manager != null) {
                    for(let j = 0; j < results.length; j++) {
                        if(results[i].manager == results[j].id) {
                            results[i].manager = results[j].first_name + ' ' + results[j].last_name
                        }
                    }
                }
            }
            console.table('\n',results);
            mainMenu()
        });
}

const addEmployee = () => {
    inquirer.prompt ([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter employee first name'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter employee last name'
        },
        {
            type: 'list',
            name: 'role',
            message: 'Select employee role',
            choices: allRoles
        },
        {
            type: 'list',
            name: 'fullName',
            message: 'Select manager name',
            choices: employeeNames
        }
    ])
    .then((data) => {
        let newFirstName = data.firstName;
        let newLastName = data.lastName;
        let newManager = idMatcher(data);
        console.log(newManager);
        db.query(`SELECT id FROM employees`, (err, results) => {
            let newId = results.length;
            newId++;
            db.query(`SELECT id FROM employee_role WHERE title = ?`, data.role, function(err, results) {
                let values = `${newId}, '${newFirstName}', '${newLastName}', ${results[0].id}, ${newManager}`;
                db.query(`INSERT INTO employees (id, first_name, last_name, role_id, manager_id) VALUES (${values})`, function(err, result) {
                    console.log('\nNew Employee Added!\n')
                    mainMenu();
                })
            })
        })
    })
}

const addDept = () => {
    inquirer.prompt(
        {
            type: 'input',
            name: 'dept',
            message: 'Enter new Department name'
        }
    )
    .then((data) => {
        console.log(data.dept)
        db.query(`INSERT INTO departments (dept_name) VALUES ('${data.dept}')`, (err, results) => {
            console.log('\nDepartment added!\n')
            mainMenu()
        })
    })
}

const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter job title'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter job salary'
        },
        {
            type: 'list',
            name: 'dept',
            message: 'Enter job department',
            choices: allDepts
        }
    ])
    .then((data) => {
        let title = data.title;
        let salary = data.salary;
        db.query(`SELECT title FROM employee_role`, (err, results) => {
            let roleId = results.length;
            roleId++;
            db.query(`SELECT id FROM departments WHERE dept_name = ?`, data.dept, function(err, results) {
                let values = `${roleId}, '${title}', ${salary}, ${results[0].id}`
                db.query(`INSERT INTO employee_role (id, title, salary, department_id) VALUES (${values})`, (err, results) => {
                    console.log('\nRole Added!\n');
                    mainMenu();
                })
            })
        })
    })
}

const updateRole = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'fullName',
            message: 'What employee would you like to update?',
            choices: employeeNames
        },
        {
            type: 'list',
            name: 'role',
            message: 'What their new role?',
            choices: allRoles
        }
    ])
    .then((data) => {
        employeeId = idMatcher(data);
        db.query(`SELECT id FROM employee_role WHERE title='${data.role}'`,(err, results) => {
            db.query(`UPDATE employees SET role_id=${results[0].id} WHERE id=${employeeId}`, (err, results) => {
                console.log(`\n${data.fullName}'s role updated to ${data.role}`)
                mainMenu()
            })
        })
    })
}

const rolesQuery = () => {
    db.query(`SELECT title FROM employee_role`, (err, results) => {
        for(let i = 0; i < results.length; i++) {
            allRoles.push(results[i].title)
        }
        if(menuSelection == 'Add Employee' || 'Update Employee Role') {
            employeeQuery()
        }
    })
}

const deptQuery = () => {
    db.query(`SELECT dept_name FROM departments`, (err, results) => {
        for(let i = 0; i < results.length; i++){
            allDepts.push(results[i].dept_name)
        }
        if(menuSelection == 'Add Role') {
            addRole()
        }
    })
}

const employeeQuery = () => {
    db.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employees`, (err, results) => {
        allEmployees = results;
        for(let i = 0; i < allEmployees.length; i++) {
            employeeNames.push(allEmployees[i].full_name)
        }
        if(menuSelection == 'Add Employee') {
            addEmployee()
        }else if(menuSelection == 'Update Employee Role') {
            updateRole()
        }
    })
}

const idMatcher = (data) => {
    for(let i = 0; i < allEmployees.length; i++) {
        if(allEmployees[i].full_name == data.fullName) {
            return allEmployees[i].id;
        }
    }
}

mainMenu()