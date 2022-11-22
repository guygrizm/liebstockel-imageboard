DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    comment TEXT NOT NULL,
    image_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO comments (username, comment, image_id) VALUES (
    'Greg',
    'Nice',
    1
);

INSERT INTO comments (username, comment, image_id) VALUES (
    'Paul',
    'Sweet!',
    2
);

INSERT INTO comments (username, comment, image_id) VALUES (
    'Manuel',
    'Love it!',
    3
);