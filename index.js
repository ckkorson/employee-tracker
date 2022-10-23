const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'ckor5250',
      database: 'employees_db'
    },
    console.log(`Connected to the classlist_db database.`)
  );

  const mainMenu = () => {
    inquirer.prompt (
        {
            type: 'list',
            name: 'menu',
            message: 'What would you linke to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 
            'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
        }
    )
    .then((data) => {
        if (data.menu === 'View All Departments') {
            viewDepartments()
        } else if(data.menu === 'View All Roles') {
            
        }
    })
  }

  const viewDepartments = () => {
    db.query('SELECT * FROM departments', function (err, results) {
        console.table(results);
        mainMenu()
      });
  }

  mainMenu()