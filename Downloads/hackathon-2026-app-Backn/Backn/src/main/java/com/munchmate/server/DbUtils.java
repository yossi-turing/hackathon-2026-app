package com.munchmate.server;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import java.sql.*;

@Component
public class DbUtils {

    private Connection connection;

    @PostConstruct
    public void init() {
        createDbConnection("root", "1234");
    }

    public void createDbConnection(String username, String password) {
        String url = "jdbc:mysql://localhost:3306/My_db";
        try {
            this.connection = DriverManager.getConnection(url, username, password);
            System.out.println("✓ התחברות למסד הנתונים הצליחה!");
        } catch (SQLException e) {
            System.out.println("✗ התחברות למסד הנתונים נכשלה!");
            e.printStackTrace();
        }
    }

    public Connection getConnection() {
        return connection;
    }
    public  String addUser(String username, String password) {
        if (connection != null) {
            // בדיקה אם המשתמש כבר קיים
            String checkSql = "SELECT COUNT(*) FROM User WHERE username = ?";
            try (PreparedStatement checkStatement = connection.prepareStatement(checkSql)) {
                checkStatement.setString(1, username);
                ResultSet resultSet = checkStatement.executeQuery();

                if (resultSet.next() && resultSet.getInt(1) > 0) {
                    return "המשתמש כבר קיים במערכת";
                }

                // אם המשתמש לא קיים, הוסף אותו
                String insertSql = "INSERT INTO User (username, password) VALUES (?, ?)";
                try (PreparedStatement insertStatement = connection.prepareStatement(insertSql)) {
                    insertStatement.setString(1, username);
                    insertStatement.setString(2, password);
                    insertStatement.executeUpdate();
                    return "ברוך הבא! המשתמש נוסף בהצלחה";
                }

            } catch (SQLException e) {
                e.printStackTrace();
                return "שגיאה בהוספת המשתמש";
            }
        } else {
            return "אין חיבור למסד הנתונים";
        }
    }
    public String checkUser(String username, String password) {
        if (connection != null) {
            String checkSql = "SELECT COUNT(*) FROM User WHERE username = ? AND password = ?";
            try (PreparedStatement checkStatement = connection.prepareStatement(checkSql)) {
                checkStatement.setString(1, username);
                checkStatement.setString(2, password);
                ResultSet resultSet = checkStatement.executeQuery();

                if (resultSet.next() && resultSet.getInt(1) > 0) {
                    return "המשתמש קיים במערכת";
                } else {
                    return "שם משתמש או סיסמה שגויים";
                }

            } catch (SQLException e) {
                e.printStackTrace();
                return "שגיאה בבדיקת המשתמש";
            }
        } else {
            return "אין חיבור למסד הנתונים";
        }
    }

}
