-- SELECT employee_role.id, employee_role.title ,departments.dept_name, employee_role.salary
-- FROM departments
-- JOIN employee_role ON employee_role.department_id=departments.id;

-- SELECT employees.id, employees.first_name, employees.last_name, departments.dept_name, employee_role.salary
-- FROM employees
-- JOIN employee_role ON employee_role.id=employees.role_id
-- JOIN departments ON departments.id=employee_role.department_id;

-- INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
-- VALUES (009, 'John', 'Jones', 002, 001)

-- SELECT title FROM employee_role WHERE id=001