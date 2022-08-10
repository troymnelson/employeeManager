USE employee_dir;

INSERT INTO department (department_name) VALUES
    ('web development'),
    ('kitchen'),
    ('management'),
    ('construction');

INSERT INTO roles (title, salary, department_id) VALUES 
    ('carpenter', 45000, 4),
    ('engineer', 100000, 1),
    ('CEO', 888888, 3),
    ('cook', 40000.00, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('troy', 'nelson', 4, 1),
    ('bob', 'ross', 1, 4),
    ('bob', 'marley', 2, 2),
    ('jim', 'carrey', 3, null);