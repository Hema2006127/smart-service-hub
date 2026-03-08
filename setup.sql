-- ===== جدول المستخدمين =====
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL DEFAULT 'viewer' -- 'admin' or 'viewer'
);

-- ===== إضافة مستخدم admin افتراضي =====
INSERT INTO Users (Username, Password, Role) VALUES ('admin', 'admin123', 'admin');
INSERT INTO Users (Username, Password, Role) VALUES ('viewer', 'viewer123', 'viewer');

-- ===== جدول الفروع (لو مش موجود) =====
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Branches' AND xtype='U')
CREATE TABLE Branches (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Location NVARCHAR(300),
    Phone NVARCHAR(50)
);
