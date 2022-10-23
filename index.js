const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'ckor5250',
      database: 'classlist_db'
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
            'View All Roles', 'Add Role', 'View All Departments', 'Add Department',
            'Quit', 'View All Employees']
        }
    )
    .then((data) => {
        console.log('selection recieved')
    })
  }

  mainMenu()