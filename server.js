const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');

const app = express();

app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employees_db'
    },
    console.log('Connected to the employees_db database')
);

const startPrompt = () =>{
    inquirer.prompt([
        {
            name: 'choices',
            message: 'What would you like to do?',
            type: 'list',
            choices: ['View all departments', 'Add department', 'View all employees', 'Add employee', 'View all roles', 'Add a role', 'Update employee role', 'Quit',],
        }
    ])
    .then((data)=> {
        switch (data.choice) {
            case 'View all departments':
                viewDep();
                break;
            case 'Add department':
                addDep();
                break;
            case 'View all employees':
                viewEmp();
                break;
            case 'Add employee':
                addEmp();
                break;
            case 'View all roles':
                viewRole();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Update employee role':
                updateRole();
                break;
            case 'Quit':
                return;

        }
    })
};

startPrompt();

function viewDep () {
    db.query('SELECT * FROM department', (err,data)=> {
        console.table(data);
        startPrompt();
    });
};

function addDep () {
    db.query("INSERT INTO department (id, department_name) VALUES ('')");
};

function viewEmp () {
    db.query("SELECT role.title, role.id, department.department_name, role.salary")
}
// db.query(``)