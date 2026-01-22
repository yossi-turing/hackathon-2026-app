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
        String url = "jdbc:mysql://localhost:3306/MyNewSchema";
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
    public String signUp(String username, String password, String phoneNumber) {
        // בדיקת תקינות מספר הטלפון
//        if (!isValidPhoneNumber(phoneNumber)) {
//            return "מספר הטלפון לא תקין. יש להזין מספר בפורמט: 05X-XXXXXXX";
//        }
        if (phoneNumber.length() == 10 && !phoneNumber.contains("-")) {
            phoneNumber = phoneNumber.substring(0, 3) + "-" + phoneNumber.substring(3);
        }

        if (connection != null) {
            // בדיקה אם המשתמש כבר קיים (אותו שם משתמש ואותה סיסמה)
            String checkSql = "SELECT COUNT(*) FROM Users WHERE username = ? AND password = ?";
            try (PreparedStatement checkStatement = connection.prepareStatement(checkSql)) {
                checkStatement.setString(1, username);
                checkStatement.setString(2, password);
                ResultSet resultSet = checkStatement.executeQuery();

                if (resultSet.next() && resultSet.getInt(1) > 0) {
                    return "המשתמש כבר קיים במערכת";
                }

                // אם המשתמש לא קיים, הוסף אותו
                String insertSql = "INSERT INTO Users (username, password, phone_number) VALUES (?, ?, ?)";
                try (PreparedStatement insertStatement = connection.prepareStatement(insertSql)) {
                    insertStatement.setString(1, username);
                    insertStatement.setString(2, password);
                    insertStatement.setString(3, phoneNumber);
                    insertStatement.executeUpdate();
                    return "ברוך הבא! המשתמש נוסף בהצלחה";
                }

            } catch (SQLException e) {
                // בדיקה אם השגיאה היא בגלל טלפון כפול
                if (e.getMessage().contains("UNIQUE") || e.getMessage().contains("phone_number")) {
                    return "מספר הטלפון כבר קיים במערכת";
                }
                e.printStackTrace();
                return "שגיאה בהוספת המשתמש";
            }
        } else {
            return "אין חיבור למסד הנתונים";
        }
    }

    // פונקציית עזר לבדיקת תקינות מספר טלפון
    private boolean isValidPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            return false;
        }

        // בדיקה שהפורמט הוא: 05X-XXXXXXX
        String phonePattern = "^05\\d-\\d{7}$";

        return phoneNumber.matches(phonePattern);
    }
    public String signIn(String username, String password) {
        if (connection != null) {
            String sql = "SELECT COUNT(*) FROM Users WHERE username = ? AND password = ?";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setString(1, username);
                statement.setString(2, password);
                ResultSet resultSet = statement.executeQuery();

                if (resultSet.next() && resultSet.getInt(1) > 0) {
                    return "ברוך הבא! התחברת בהצלחה";
                } else {
                    return "המשתמש לא קיים במערכת";
                }

            } catch (SQLException e) {
                e.printStackTrace();
                return "שגיאה בהתחברות";
            }
        } else {
            return "אין חיבור למסד הנתונים";
        }
    }
    public String removeUser(String username, String password) {
        if (connection != null) {
            String sql = "DELETE FROM Users WHERE username = ? AND password = ?";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setString(1, username);
                statement.setString(2, password);
                int rowsAffected = statement.executeUpdate();

                if (rowsAffected > 0) {
                    return "המשתמש הוסר בהצלחה";
                } else {
                    return "אין משתמש כזה במערכת";
                }

            } catch (SQLException e) {
                e.printStackTrace();
                return "שגיאה בהסרת המשתמש";
            }
        } else {
            return "אין חיבור למסד הנתונים";
        }
    }

}
