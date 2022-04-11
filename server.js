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

const startP = ()=>{
    inquirer.prompt([
        {
            name: 'selection',
            message: 'What would you like to do?',
            type: 'list',
            choices: [
                    'View all departments', 'Add department', 'View all employees', 'Add employee', 'View all roles', 'Add a role', 'Update employee role'
            ],
        }
    ]).then(function(value){
        switch (value.selection) {
            case 'View all departments':
                viewDept();
                break;
            case 'View all employees':
                viewEmp();
                break;
            case 'View all roles':
                viewRole();
                break;
            case 'Add department':
                addDept();
                break;
            case 'Add employee':
                addEmp();
                break;
            case 'Add a role':
                addR();
                break;
            case 'Update employee role':
                upEmp();
                break;
        }
    })
};

function viewEmp() {
    db.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.department_name, CONCAT(employee.first_name, ' ',employee.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department ON department.id = role.department_id left JOIN employee e ON employee.manager_id = e.id",
    //have to use employee on e as the employee isnt a unique alias
    //this was giving me a major headache until stackoverflow
    function (err,res) {
        if (err)  throw err
        onsole.table(res)
        startP();
    })
}

function viewRole() {
    db.query("SELECT employee.first_name, employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id",
    function (err,res) {
        if(err) throw err
        console.table(res)
        startP();
    })
}

function viewDept() {
    db.query("SELECT employee.first_name, employee.last_name, department.department_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id",
    function (err,res) {
        if (err) throw err
        console.table(res)
        startP();
    })
}

var rolSet =[];
function rolChoice(){
    db.query("SELECT * FROM role", 
    function (err,res) {
        if(err) throw err
        for (var i = 0; i < res.length; i++) {
            rolSet.push(res[i].title);
        }
    })
    return rolSet;
}

var mgA=[];
function mgChoice(){
    db.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err,res){
        if(err) throw err
        for (var i=0; i<res.length; i++){
            mgA.push(res[i].first_name);
        }
    })
    return mgA;
}
function addEmp(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'first',
            message: 'First name'
        },
        {
            type: 'input',
            name: 'last',
            message: 'Last name'
        },
        {
            type: 'list',
            name: 'role',
            message: 'Role',
            choices: rolChoice()
        },
        {
            type: 'rawlist',
            name: 'mgmt',
            message: 'Manager name',
            choices: mgChoice()
        },
    ]).then(function(value){
        var rId = rolChoice().indexOf(value.selection) + 1
        var mId = mgChoice().indexOf(value.selection) + 1
        db.query("INSERT INTO employee SET ?",{
            first_name: value.first,
            last_name: value.last,
            manager_id: mId,
            role_id: rId
        }, function(err){
            if(err) throw err
            console.table(value)
            startP()
        })
    })
}

function upEmp(){
    db.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function(err,res){
        if(err) throw err
        console.log(res)
        inquirer.prompt([
            {
                name: 'last',
                type: 'rawlist',
                choices: function(){
                    var last =[];
                    for (var i=0; i< res.length; i++) {
                        last.push(res[i].last_name);
                    }
                    return last
                },
                message: 'Last name?',
            },
            {
                name: 'newRole',
                message: 'New title',
                type: 'rawlist',
                choices: rolChoice()
            },
        ]).then(function(value){
            var rId=rolChoice().indexOf(value.newRole) + 1
            db.query("UPDATE employee SET WHERE ?", 
            {
                last_name: value.last
            },
            {
                role_id: rId
            },
            function (err) {
                if(err) throw err
                console.table(value)
                startP();
            })
        });
    });
}

function addR() {
    db.query("SELECT role.title, role.salary FROM role", function(err,res){
        inquirer.prompt([
            {
                message: 'Role title?',
                type: 'input',
                name: 'newTitle',
            },
            {
                message: 'Salary?',
                type: 'input',
                name: 'pay',
            },
        ]).then(function(res){
            db.query("INSERT INTO role SET ?", 
            {
                title: res.newTitle,
                salary: res.pay,
            },
            function(err){
                if(err) throw err
                console.table(res);
                startP();
            })
        });
    });
}

startP();
