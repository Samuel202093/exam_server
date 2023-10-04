CREATE TABLE users(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    firstname VARCHAR(15) NOT NULL,
    lastname VARCHAR(15) NOT NULL,
    email TEXT NOT NULL UNIQUE,
    userPassword TEXT NOT NULL
);

CREATE TABLE question_type(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    exam_type VARCHAR NOT NULL
);

CREATE TABLE question_subjectTopic (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    type_id BIGINT NOT NULL REFERENCES question_type(id) ON UPDATE CASCADE ON DELETE CASCADE,
    exam_subject VARCHAR NOT NULL,
    exam_topic VARCHAR NOT NULL
);


CREATE TABLE questions(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    type_id BIGINT NOT NULL REFERENCES question_type(id) ON UPDATE CASCADE ON DELETE CASCADE,
    subjectTopic_id BIGINT NOT NULL REFERENCES question_subjectTopic(id) ON UPDATE CASCADE ON DELETE CASCADE, 
    exam_year NUMERIC NOT NULL, 
    imgUrl VARCHAR, 
    exam_questions VARCHAR NOT NULL,
    options JSON NOT NULL,
    solution VARCHAR NOT NULL
);


