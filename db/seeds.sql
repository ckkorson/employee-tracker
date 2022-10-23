INSERT INTO departments (dept_name)
VALUES  ('Sales'),
        ('Engineering'),
        ('Finance'),
        ('Human Resources');

INSERT INTO employee_role (id, title, salary, department_id)
VALUES  (001,'Sales Lead', 150000, 1),
        (002, 'Salesperson', 80000, 1),
        (003, 'Engineering Manager', 200000, 2),
        (004, 'Software Engineer', 120000, 2),
        (005, 'Account Manager', 180000, 3),
        (006, 'Accountant', 90000, 3),
        (007, 'HR Manager', 110000, 4),
        (008, 'HR Specialist', 85000,4);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES  (001, 'John', 'Smith', 001, NULL),
        (002, 'Tyler', 'Bowen', 002, 001),
        (003, 'Caleb', 'Korson', 003, NULL),
        (004, 'Emily', 'Korson', 004, 003),
        (005, 'Jane', 'Doe', 005, NULL),
        (006, 'Albert', 'Swanson', 006, 005),
        (007, 'Mark', 'Lyttle', 007, NULL),
        (008, 'Zoe', 'Richards', 008, 007);