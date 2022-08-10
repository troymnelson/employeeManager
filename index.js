const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    database: 'employee_dir',
    user: 'root',
    password: ''
});

const employees = async () => {
    const dataArray = await db.query(`
        SELECT employee.id 'EMPLOYEE ID', employee.first_name 'FIRST NAME', employee.last_name 'LAST NAME', employee.role_id, department.department_name 'DEPARTMENTS', roles.salary 'SALARY', employee.manager_id 'MANAGER ID'
        FROM employee, department, roles
        WHERE employee.role_id = roles.id AND roles.department_id = department.id;
    `);
    console.table(dataArray[0]);
};

const viewAllEmployees = (data) => {
    employees()
        .then(main);
};

const allEmployees = async (dep_id) => {
    const dataArray = await db.query(`SELECT * FROM employee`);
    return dataArray[0];
};

const managerList = async () => {
    const dataArray = await db.query(`SELECT first_name, id FROM employee WHERE manager_id = 0;`);
    return dataArray[0];
};

const getAllRoles = async () => {
    const dataArray = await db.query(`
        SELECT roles.title 'JOB TITLE', roles.id 'ROLE NUMBER', department.department_name 'DEPARTMENT', roles.salary 'SALARY'
        FROM roles
        JOIN department ON roles.department_id = department.id;
    `)
    console.table(dataArray[0]);
};

const roles = () => {
    getAllRoles()
        .then(main)
};

const getRoles = async () => {
    const dataArray = await db.query(`SELECT * FROM roles;`);
    return dataArray[0];
};

const allRoles = async (dep_id) => {
    const dataArray = await db.query(`SELECT title, id FROM roles;`);
    return dataArray[0];
};

const viewAllDepartments = async () => {
    const dataArray = await db.query(`SELECT * FROM department;`);
    return dataArray[0];
};

const showDepartments = async () => {
    const dataArray = await db.query(`SELECT * FROM department;`)
    console.table(dataArray[0]);
    return results[0];
};

const departments = () => {
    showDepartments()
        .then(main);
};

const main = async () => {
    const main = await inquirer.prompt(
        [{
            type: 'list',
            name: 'doNext',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']

        }]).then(data => {
            if (data.doNext === 'View All Employees') {
                viewAllEmployees();
            } else if (data.doNext === 'View All Roles') {
                roles();
            } else if (data.doNext === 'View All Departments') {
                departments();
            } else if (data.doNext === 'Add Department') {
                addDepartment();
            } else if (data.doNext === 'Add Employee') {
                addEmployee();
            } else if (data.doNext === 'Add Role') {
                addRole();
            } else if (data.doNext === 'Update Employee Role') {
                UpdateEmployeeRole();
            };
        });
};


// ADD EMPLOYEE
const addEmployee = async () => {
    var management = await managerList();
    var dataArray = await getRoles();
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is employees first name?'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is employees last name?'
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is employees role?',
            choices: dataArray.map(dep => {
                return {
                    name: dep.title,
                    value: dep.id
                };
            })
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Who is the employees manager?',
            choices: management.map(dep => {
                return {
                    name: dep.first_name,
                    value: dep.id
                }
            })
        }
    ]).then(answer => {
        console.log(`Created new employee ${answer.firstName}`);
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.firstName}', '${answer.lastName}', '${answer.role}', '${answer.manager}');`);
    }).then(main);
};


//UPDATE EMPLOYEE
async function UpdateEmployeeRole(data) {
    var updateAnEmployee = await allEmployees()
    var updateARole = await allRoles();
    inquirer.prompt([{
        type: 'list',
        name: 'updateEmp',
        message: 'Which employee would you like to update?',
        choices: updateAnEmployee.map(dep => {
            return {
                name: dep.first_name,
                value: dep.id
            }
        })
      },
      {
        type: 'list',
        name: 'updatedEmpRole',
        message: 'What do you want the selected employees new role to be?',
        choices: updateARole.map(dep => {
            return {
                name: dep.title,
                value: dep.id
            }
        })
      }, 
    ]).then(answer => {
        db.query(`UPDATE employee SET role_id='${answer.updatedEmpRole}' WHERE id='${answer.updateEmp}';`)
        console.log(`Successfully updated employee role`);    
    }).then(main);
}

// ADD DEPARTMENT
function addDepartment(data) {
    inquirer.prompt(
        [
            {
                type: 'input',
                name: 'addDep',
                message: 'What is the name of the new department?',
            }
        ]
    ).then(function (answer) {
        db.query(`INSERT INTO department(department_name) VALUES ('${answer.addDep}');`);
        console.log(`Added ${answer.addDep} to the department role`);
    })
}

// ADD ROLE
async function addRole(data) {
    var departments = await viewAllDepartments();
    inquirer.prompt(
        [
            {
                type: 'input',
                name: 'createNewRole',
                message: 'What is the new role?'
            },
            {
                type: 'input',
                name: 'newRoleSalary',
                message: 'What is the salary for the new role?',
            },
            {
                type: 'list',
                name: 'newRoleDepartment',
                message: 'What department is the new role for?',
                choices: departments.map(dep => {
                    return {
                        name: dep.department_name,
                        value: dep.id
                    }
                })
            }
        ]
    ).then(answer => {
        let newSalary = parseFloat(answer.newRoleSalary)
        db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${answer.createNewRole}', '${newSalary}', '${answer.newRoleDepartment}');`)
        console.log(`Added ${answer.createNewRole} to roles`)
    }).then(main)
}


main();