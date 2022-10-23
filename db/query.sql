SELECT employee_role.id, employee_role.title ,departments.dept_name, employee_role.salary
FROM departments
JOIN employee_role ON employee_role.department_id=departments.id;

SELECT employees.id, employees.first_name, employees.last_name, 