INSERT INTO department (department_name)
VALUES ("Web Development"),
       ("Data Science"),
       ("Math"),
       ("Electives");

INSERT INTO role (title, salary, department_id)
VALUES ("Intro to JavaScript", 30000, 1),
       ("Data Science", 35000, 2),
       ("Linear Algebra", 40000, 3),
       ("Machine Learning", 50000, 4),
       ("Game Design", 80000, 1),
       ("Cloud Development", 70000, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Dave", "smith", 1, null), ("Bob", "Iger", 3, 2), ("Tina", "Bag", 2, 2), ("Robert", "Price", 4, null);