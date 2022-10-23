const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

let allRoles =['Sales Lead', 'Salesperson', 'Engineering Manager', 'Software Engineer', 'Account Manager',
'Accountant', 'HR Manager', 'HR Specialist'];

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'ckor5250',
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
        if (data.menu === 'View All Departments') {
            viewDepartments()
        } else if(data.menu === 'View All Roles') {
            viewRoles()
        } else if (data.menu === 'View All Employees') {
            viewEmployees()
        } else if (data.menu === 'Add Employee') {
            addEmployee()
        }
    })
  }

  const viewDepartments = () => {
    db.query('SELECT * FROM departments', function (err, results) {
        console.table(results);
        mainMenu()
      });
  }

  const viewRoles = () => {
    db.query(`SELECT employee_role.id, employee_role.title ,departments.dept_name, employee_role.salary
        FROM departments
        JOIN employee_role ON employee_role.department_id=departments.id`, function (err, results) {
            console.table(results);
            mainMenu()
          });
  }

  const viewEmployees = () => {
    db.query(`SELECT employees.id, employees.first_name, employees.last_name, departments.dept_name, employee_role.salary
        FROM employees
        JOIN employee_role ON employee_role.id=employees.role_id
        JOIN departments ON departments.id=employee_role.department_id`, function(err, results) {
            console.table(results);
            mainMenu()
        })
  }

  const addEmployee = () => {
    inquirer.prompt ([
        {
            type: 'input',
            name: 'id',
            message: 'Enter employee id'
        },
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
            type: 'input',
            name: 'manager',
            message: 'Enter manager id'
        }
    ])
    .then((data) => {
        let newId = data.id;
        let newFirstName = data.firstName;
        let newLastName = data.lastName;
        let newManager = data.manager
        db.query(`SELECT id FROM employee_role WHERE title = ?`, data.role, function(err, results) {
            // console.log(results[0].id)
            let values = [newId, newFirstName, newLastName, results[0].id, newManager]
            console.log(values)
            db.query(`INSERT INTO employees (id, first_name, last_name, role_id, manager_id) VALUES ?`, values, function(err, result) {
                console.log('New Employee Added')
                mainMenu();
            })
        })
        // db.query(`INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
        //     VALUES (009, 'John', 'Jones', 002, 001)`, function(err, result) {
        //         console.log('New Employee Added');
        //         mainMenu();
        //     })
    })
  }

  const rolesQuery = (i) => {
    // let title
    db.query(`SELECT title FROM employee_role WHERE id = ?`, i, (err, results) => {
        // console.log(results[0].title)
        // title = results[0].title
        allRoles.push(results[0].title)
        // console.log(title)
    })
    // console.log(title)
    // return title
  }

  const roleArrayBuilder = () => {
    let i = 001;
    rolesQuery(i)
    // while(rolesQuery(i) != null) {
        console.log(allRoles)
    // }
  }
// roleArrayBuilder()
  mainMenu()