-- Create all the tables required
IF NOT EXISTS (
    SELECT *
    FROM sys.tables
    WHERE name='employee'
)
BEGIN
    CREATE TABLE employee(
        id INT PRIMARY KEY,
        name VARCHAR(50),
        position VARCHAR(50),
        dateofbirth DATE,
        dateofjoining DATE,
        aadharnumber VARCHAR(16),
        esino VARCHAR(50),
        esiContribution VARCHAR(50)
    );
end

IF NOT EXISTS (
    SELECT *
    FROM sys.tables
    WHERE name='AttendanceLogs'
)
    BEGIN
        CREATE TABLE AttendanceLogs(
            AttendanceID bigint IDENTITY(1, 1),
            UserID int PRIMARY KEY,
            AttendanceDate DATE,
            StatusID tinyint,
            CreatedAtUtc datetime2 DEFAULT SYSUTCDATETIME()
        );
    end


IF NOT EXISTS (
    SELECT *
    FROM sys.tables
    WHERE name='AttendanceStatuses'
)
    BEGIN
        CREATE TABLE AttendanceStatuses(
            StatusID tinyint IDENTITY(1,1) PRIMARY KEY,
            StatusName VARCHAR(20)
        );
    end

-- Add all the randomly generated values to the table

INSERT INTO employee(id, name, position, dateofbirth, dateofjoining, aadharnumber, esino, esiContribution)
    VALUES(100, 'Rohil Verma', 'Manager', '1996-08-24', '2024-09-26', '6557788976540909', '123123', '300'),
    (101, 'Aarav Sharma', 'Software Engineer', '1995-05-12', '2022-01-15', '1234567890123456', '456456', '301'),
    (102, 'Priya Singh', 'Analyst', '1998-11-20', '2023-03-10', '9876543210987654', '789789', '301'),
    (103, 'Karan Patel', 'QA Tester', '1994-02-14', '2021-08-14', '7412589630147852', '741852', '302'),
    (104, 'Sneha Desai', 'HR Executive', '1992-07-09', '2019-02-20', '9632587410258963', '963258', '303'),
    (105, 'Vikram Singh', 'Product Manager', '1988-12-05', '2018-11-10', '1254789630145236', '125478', '304'),
    (106, 'Anjali Gupta', 'UI/UX Designer', '1995-09-18', '2023-01-25', '3698521470258963', '369852', '305'),
    (107, 'Rohan Mehta', 'Data Analyst', '1996-04-30', '2022-09-15', '7896541230147852', '147258', '301'),
    (108, 'Pooja Joshi', 'Scrum Master', '1990-01-14', '2020-07-12', '1478523690125478', '258369', '302'),
    (109, 'Rahul Chauhan', 'DevOps Engineer', '1993-08-25', '2021-03-18', '2589631470258963', '369147', '303'),
    (110, 'Neha Sharma', 'Backend Developer', '1998-02-11', '2023-05-22', '3697412580147852', '789123', '301'),
    (111, 'Amit Kumar', 'Frontend Developer', '1991-06-19', '2019-10-05', '8521479630258741', '456789', '301'),
    (112, 'Kavita Reddy', 'Database Admin', '1997-10-08', '2022-12-01', '7418529630147852', '321654', '304'),
    (113, 'Suresh Iyer', 'Systems Analyst', '1989-05-21', '2017-09-15', '9638527410258963', '654321', '305'),
    (114, 'Meera Nair', 'Marketing Lead', '1994-12-30', '2021-04-10', '1597534680258963', '987654', '306'),
    (115, 'Nitin Agarwal', 'Support Engineer', '1992-03-27', '2018-07-25', '3571592680147852', '852741', '307'),
    (116, 'Sanjay Das', 'Content Writer', '1996-11-15', '2023-02-18', '4682581590369852', '741963', '308'),
    (117, 'Divya Kapoor', 'Sales Executive', '1995-07-04', '2022-11-05', '2581473690145236', '963852', '309'),
    (118, 'Varun Malhotra', 'Operations Manager', '1993-01-29', '2020-05-12', '1472583690258741', '159357', '310'),
    (119, 'Ajay Pillai', 'Security Analyst', '1991-04-16', '2019-12-10', '8529637410369852', '456123', '301'),
    (120, 'Swati Jain', 'Technical Writer', '1998-08-05', '2023-06-30', '7413698520147852', '123789', '308');

INSERT INTO AttendanceStatuses(StatusName)
    VALUES('Present'),
    ('Absent'),
    ('Leave');

INSERT INTO AttendanceLogs(UserID, AttendanceDate, StatusID)
VALUES
    (101, '2024-09-01', 1), (102, '2024-09-01', 2), (103, '2024-09-01', 1), (104, '2024-09-01', 3), (105, '2024-09-01', 1),
    (106, '2024-09-01', 1), (107, '2024-09-01', 2), (108, '2024-09-01', 1), (109, '2024-09-01', 1), (110, '2024-09-01', 3),
    (111, '2024-09-01', 1), (112, '2024-09-01', 1), (113, '2024-09-01', 2), (114, '2024-09-01', 1), (115, '2024-09-01', 1),
    (116, '2024-09-01', 2), (117, '2024-09-01', 1), (118, '2024-09-01', 3), (119, '2024-09-01', 1), (120, '2024-09-01', 1),
    (101, '2024-09-02', 1), (102, '2024-09-02', 1), (103, '2024-09-02', 2), (104, '2024-09-02', 1), (105, '2024-09-02', 3),
    (106, '2024-09-02', 1), (107, '2024-09-02', 1), (108, '2024-09-02', 1), (109, '2024-09-02', 2), (110, '2024-09-02', 1),
    (111, '2024-09-02', 3), (112, '2024-09-02', 1), (113, '2024-09-02', 1), (114, '2024-09-02', 2), (115, '2024-09-02', 1),
    (116, '2024-09-02', 1), (117, '2024-09-02', 2), (118, '2024-09-02', 1), (119, '2024-09-02', 1), (120, '2024-09-02', 3),
    (101, '2024-09-03', 2), (102, '2024-09-03', 1), (103, '2024-09-03', 1), (104, '2024-09-03', 1), (105, '2024-09-03', 2),
    (106, '2024-09-03', 3), (107, '2024-09-03', 1), (108, '2024-09-03', 2), (109, '2024-09-03', 1), (110, '2024-09-03', 1),
    (111, '2024-09-03', 1), (112, '2024-09-03', 2), (113, '2024-09-03', 3), (114, '2024-09-03', 1), (115, '2024-09-03', 1),
    (116, '2024-09-03', 1), (117, '2024-09-03', 3), (118, '2024-09-03', 1), (119, '2024-09-03', 2), (120, '2024-09-03', 1),
    (101, '2024-09-04', 1), (102, '2024-09-04', 3), (103, '2024-09-04', 1), (104, '2024-09-04', 2), (105, '2024-09-04', 1),
    (106, '2024-09-04', 1), (107, '2024-09-04', 1), (108, '2024-09-04', 3), (109, '2024-09-04', 1), (110, '2024-09-04', 2),
    (111, '2024-09-04', 1), (112, '2024-09-04', 1), (113, '2024-09-04', 1), (114, '2024-09-04', 3), (115, '2024-09-04', 1),
    (116, '2024-09-04', 2), (117, '2024-09-04', 1), (118, '2024-09-04', 1), (119, '2024-09-04', 1), (120, '2024-09-04', 2),
    (101, '2024-09-05', 1), (102, '2024-09-05', 2), (103, '2024-09-05', 3), (104, '2024-09-05', 1), (105, '2024-09-05', 1),
    (106, '2024-09-05', 2), (107, '2024-09-05', 1), (108, '2024-09-05', 1), (109, '2024-09-05', 1), (110, '2024-09-05', 3),
    (111, '2024-09-05', 2), (112, '2024-09-05', 1), (113, '2024-09-05', 1), (114, '2024-09-05', 1), (115, '2024-09-05', 2),
    (116, '2024-09-05', 3), (117, '2024-09-05', 1), (118, '2024-09-05', 2), (119, '2024-09-05', 1), (120, '2024-09-05', 1);

GO

-- =================================================================
-- INDEXES AND CONSTRAINTS
-- =================================================================

-- Add a foreign key constraint from AttendanceLogs to employee
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_AttendanceLogs_Employee')
BEGIN
    ALTER TABLE AttendanceLogs
    ADD CONSTRAINT FK_AttendanceLogs_Employee
    FOREIGN KEY (UserID) REFERENCES employee(id);
END
GO

-- Add a foreign key constraint from AttendanceLogs to AttendanceStatuses
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_AttendanceLogs_Status')
BEGIN
    ALTER TABLE AttendanceLogs
    ADD CONSTRAINT FK_AttendanceLogs_Status
    FOREIGN KEY (StatusID) REFERENCES AttendanceStatuses(StatusID);
END
GO

-- Create a unique compound index on UserID and AttendanceDate in AttendanceLogs
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AttendanceLogs_User_Date' AND object_id = OBJECT_ID('AttendanceLogs'))
BEGIN
    CREATE UNIQUE INDEX IX_AttendanceLogs_User_Date
    ON AttendanceLogs(UserID, AttendanceDate);
END
GO

-- Create a unique index on the aadharnumber in the employee table
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_employee_aadharnumber' AND object_id = OBJECT_ID('employee'))
BEGIN
    CREATE UNIQUE INDEX IX_employee_aadharnumber
    ON employee(aadharnumber);
END
GO

-- Create a unique index on the esino in the employee table
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_employee_esino' AND object_id = OBJECT_ID('employee'))
BEGIN
    CREATE UNIQUE INDEX IX_employee_esino
    ON employee(esino);
END
GO

-- Create a non-clustered index on the name in the employee table
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_employee_name' AND object_id = OBJECT_ID('employee'))
BEGIN
    CREATE INDEX IX_employee_name
    ON employee(name);
END
GO

-- Create a unique index on the StatusName in the AttendanceStatuses table
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AttendanceStatuses_StatusName' AND object_id = OBJECT_ID('AttendanceStatuses'))
BEGIN
    CREATE UNIQUE INDEX IX_AttendanceStatuses_StatusName
    ON AttendanceStatuses(StatusName);
END
GO

ALTER TABLE AttendanceLogs
    ADD CONSTRAINT UQ_User_Date
        UNIQUE (UserID, AttendanceDate);
