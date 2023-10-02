CREATE TABLE users(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    firstname VARCHAR(15) NOT NULL,
    lastname VARCHAR(15) NOT NULL,
    email TEXT NOT NULL UNIQUE,
    userPassword TEXT NOT NULL
);

CREATE TABLE exam_questions(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    exam_year NUMERIC NOT NULL,
    exam_type VARCHAR(100) NOT NULL,
    exam_subject VARCHAR(200) NOT NULL,
    topic VARCHAR(200) NOT NULL,
    question VARCHAR NOT NULL,
    imgUrl VARCHAR,
    options JSON NOT NULL,
    solution VARCHAR NOT NULL
);

CREATE TABLE question_type(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    exam_type VARCHAR 
);

CREATE TABLE question_subject(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    exam_subject VARCHAR 
);

CREATE TABLE question_topic(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    topic VARCHAR 
);

CREATE TABLE questions(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    type_id BIGINT NOT NULL REFERENCES question_type(id) ON UPDATE CASCADE ON DELETE CASCADE,
    subject_id BIGINT NOT NULL REFERENCES question_subject(id) ON UPDATE CASCADE ON DELETE CASCADE,
    topic_id BIGINT NOT NULL REFERENCES question_topic(id) ON UPDATE CASCADE ON DELETE CASCADE, 
    exam_year NUMERIC NOT NULL, 
    imgUrl VARCHAR, 
    exam_questions VARCHAR NOT NULL,
    options JSON NOT NULL,
    solution VARCHAR NOT NULL
);


