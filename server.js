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

const startPrompt = [
        {
            name: 'choices',
            message: 'What would you like to do?',
            type: 'list',
            choices: ['View all departments', 'Add department', 'View all employees', 'Add employee', 'View all roles', 'Add a role', 'Update employee role', 'Quit',
        ],
        },
    ];


function choose() {
    inquirer.prompt(startPrompt).then((data)=> {
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
    });
};


function viewDep () {
    db.query('SELECT * FROM department', (err,data)=> {
        console.table(data);
        choose();
    });
};

function addDep () {
    db.query(`INSERT INTO department (id, department_name) VALUES ('${data}')`, (err, data)=> {
        console.log(data);
        console.log(err);
        choose();
    });
};

function viewEmp () {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary,CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee JOIN role ON role.id = employee.role_id JOIN department ON department.id = role.department_id LEFT JOIN employee e on employee.manager_id = e.id",
    (err, data) => {
        console.table(data);
        console.table(err);
        choose();
    }
  );
}

function addEmp() {
    inquirer.prompt([
        {
            name: "First",
            type: "input",
            message: "What is the employees first name?",
        },
        {
            name: "Last",
            type: "input",
            message: "What is the employees last name?",
        },
        {
            name: "mgmt",
            type: "input",
            message: "What is the manager ID?",
        },
        {
            name: "Role",
            type: "input",
            message: "What is the role for the employee?",
        },
    ])
    .then((answer)=>{
        db.query( `INSERT INTO employee VALUES (default, "${answer.First}", "${answer.last}", "${answer.mgmt}", "${answer.Role}")`);
       choose();
    });
}

function viewRole () {
    db.query("SELECT role.title, role.id, department.department_name, role.salary JOIN department ON department.id = role.department_id",
    (err, data) => {
        console.table(data);
        console.table(err);
        choose();
    }
  );
}


function addRole () {
inquirer.prompt([
    {
        name: "addedRole",
        type: "input",
        message: "What role do you want to add?",
    },
    {
        name: "Department",
        type: "input",
        message: "What is the departments ID for this role?"
    },
    {
        name: "Salary",
        type: "input",
        message: "What is the salary for this role?",
    },
])
.then((answer)=>{
    db.query(
        `INSERT INTO role VALUES (default, "${answer.addedRole}", "${answer.Departnment}", "${answer.Salary}")`,
        (err, res)=>{
            console.log(err);
            console.log(`${answer.addedRole}`);
            choose();
        }
    );
});

}
choose();
