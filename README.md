# Final-project
全端系統

筆記：https://docs.google.com/presentation/d/1yzUF-qynivE1rJp1G2oiPt8gku3gEL2L4SQ8ILv9Wd8/edit#slide=id.g2e0b58ec68e_0_10

control+c=中斷
cd /Users/kg/Desktop/大一下期末專題
node server.js


  res.sendFile(__dirname + '/public/麥當勞點餐系統.html');  不是  res.sendFile(__dirname + '/public/index.html');會連不到


  用vscode的mysql插件時，新增完table後要按右上角的小執行按鈕才會儲存成功


(base) kg@MacBook-Pro 大一下期末專題 % /usr/local/mysql/bin/mysql -h 127.0.0.1 -P 3306 -u root -p'0909711680'在終端中叫出sql

mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 59
Server version: 8.3.0 MySQL Community Server - GPL

Copyright (c) 2000, 2024, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| test_user          |
+--------------------+
5 rows in set (0.00 sec)

mysql> CREATE DATABASE mc;
Query OK, 1 row affected (0.00 sec)

mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mc                 |
| mysql              |
| performance_schema |
| sys                |
| test_user          |
+--------------------+
6 rows in set (0.00 sec)

mysql> USE mc;
Database changed


原先sql:
CREATE TABLE `登入` (
    `姓名` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `電話` char(10) NOT NULL,
    `密碼` char(10) NOT NULL,
    PRIMARY KEY (`電話`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

Referencing column '星級評價' and referenced column '姓名' in foreign key constraint '評論_ibfk_1' are incompatible.問題是因為嘗試將不同類型的欄位設為外鍵。在資料庫中，外鍵約束需要引用的列類型必須相容。具體來說，星級評價（通常是一個整數類型）和姓名（通常是字串類型）是不同的類型，不能互相引用。

所以要用這個方法:
刪除原先的欄位再創新的（因為是插件所以這麼麻煩）
-- 修改登入表，添加 user_id
添加用户ID到登入表：
先添加user_id作为主键。
修改點餐和評論表：
添加user_id字段并建立外键约束。

为了将點餐和評論表与登入表建立外键关系，我们需要对现有的表结构进行修改，确保它们能够正确地关联。首先，需要在登入表中添加一个唯一标识符（例如，user_id）以便于引用。然后，我们可以在點餐和評論表中添加外键字段。

在 VSCode 使用 MySQL 插件执行 SQL 语句可以按照以下步骤进行：

打开 VSCode，并确保已安装 MySQL 插件，例如 MySQL 或 MySQL Syntax 等。
在 VSCode 中打开你的项目或文件夹。
打开 MySQL 插件的命令面板，通常是通过 Ctrl + Shift + P（Windows/Linux）或 Cmd + Shift + P（Mac）然后输入 MySQL 进入的。
在 MySQL 命令面板中，选择 "MySQL: Run Query" 或类似的选项，这会打开一个新的 SQL 编辑器。
在 SQL 编辑器中粘贴以下 SQL 语句：
sql
複製程式碼
INSERT INTO `登入` (`姓名`, `電話`, `密碼`)
SELECT `姓名`, `電話`, `密碼` FROM `註冊`;
确保你已经连接到了正确的数据库，然后点击运行按钮（通常是一个播放箭头或者是 Run 按钮）执行这段 SQL 语句。
在执行之前，请确保你已经正确配置了 MySQL 插件，包括连接到了正确的数据库和表。此外，这段 SQL 语句会将 註冊 表中的数据插入到 登入 表中，确保两个表结构相匹配。

在終端顯示sql:/usr/local/mysql/bin/mysql -h 127.0.0.1 -P 3306 -u root -p'0909711680'

(base) kg@248-236 大一下期末專題 % /usr/local/mysql/bin/mysql -h 127.0.0.1 -P 3306 -u root -p'0909711680'
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 142
Server version: 8.3.0 MySQL Community Server - GPL

Copyright (c) 2000, 2024, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> ALTER TABLE `評論`
    -> ADD COLUMN `電話` char(10) NOT NULL,
    -> ADD FOREIGN KEY (`電話`) REFERENCES `登入`(`電話`);
ERROR 1046 (3D000): No database selected
mysql> 
mysql> ALTER TABLE `點餐`
    -> ADD COLUMN `電話` char(10) NOT NULL,
    -> ADD FOREIGN KEY (`電話`) REFERENCES `登入`(`電話`);
ERROR 1046 (3D000): No database selected
mysql> USE mc; -- 'mc' 是您的數據庫名稱
Database changed
mysql> 
mysql> ALTER TABLE `評論`
    -> ADD COLUMN `電話` char(10) NOT NULL,
    -> ADD FOREIGN KEY (`電話`) REFERENCES `登入`(`電話`);

ALTER TABLE `點餐`
ADD COLUMN `電話` char(10) NOT NULL,
ADD FOREIGN KEY (`電話`) REFERENCES `登入`(`電話`);
ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`mc`.`#sql-581_8e`, CONSTRAINT `評論_ibfk_1` FOREIGN KEY (`電話`) REFERENCES `登入` (`電話`))
mysql> 
mysql> ALTER TABLE `點餐`
    -> ADD COLUMN `電話` char(10) NOT NULL,
    -> ADD FOREIGN KEY (`電話`) REFERENCES `登入`(`電話`);
ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`mc`.`#sql-581_8e`, CONSTRAINT `點餐_ibfk_1` FOREIGN KEY (`電話`) REFERENCES `登入` (`電話`))
mysql> -- 為 `評論` 表添加 `電話` 列和外鍵約束
Query OK, 0 rows affected (0.00 sec)

mysql> ALTER TABLE `評論`
    -> ADD COLUMN `電話` char(10) NOT NULL,
    -> ADD CONSTRAINT `fk_評論_登入` FOREIGN KEY (`電話`) REFERENCES `登入`(`電話`);

-- 為 `點餐` 表添加 `電話` 列和外鍵約束
ALTER TABLE `點餐`
ADD COLUMNERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`mc`.`#sql-581_8e`, CONSTRAINT `fk_評論_登入` FOREIGN KEY (`電話`) REFERENCES `登入` (`電話`))
mysql> 
mysql> -- 為 `點餐` 表添加 `電話` 列和外鍵約束
Query OK, 0 rows affected (0.00 sec)

mysql> ALTER TABLE `點餐`
    -> ADD COLUMN `電話` char(10) NOT NULL,
    -> ADD CONSTRAINT `fk_點餐_登入` FOREIGN KEY (`電話`) REFERENCES `登入`(`電話`);
ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`mc`.`#sql-581_8e`, CONSTRAINT `fk_點餐_登入` FOREIGN KEY (`電話`) REFERENCES `登入` (`電話`))
mysql> INSERT INTO 登入 (姓名, 電話, 密碼)
    -> SELECT 姓名, 電話, 密碼 FROM 註冊;
Query OK, 4 rows affected (0.01 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql> -- 為 `評論` 表添加 `電話` 列和外鍵約束
Query OK, 0 rows affected (0.00 sec)

mysql> ALTER TABLE `評論`
    -> ADD COLUMN `電話` char(10) NOT NULL,
    -> ADD CONSTRAINT `fk_評論_登入` FOREIGN KEY (`電話`) REFERENCES `登入`(`電話`);

-- 為 `點餐` 表添加 `電話` 列和外鍵約束
ALTER TABLE `點餐`
ADD COLUMN `電話` char(10) NOT NULL,
ADD CONSTRAINT `fk_點餐_登入` FOREIGN KEY (`電話`) REFERENCES `登入`(`電話`);
Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> 
mysql> -- 為 `點餐` 表添加 `電話` 列和外鍵約束
Query OK, 0 rows affected (0.00 sec)

mysql> ALTER TABLE `點餐`
    -> ADD COLUMN `電話` char(10) NOT NULL,
    -> ADD CONSTRAINT `fk_點餐_登入` FOREIGN KEY (`電話`) REFERENCES `登入`(`電話`);
Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> 
