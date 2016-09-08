import java.sql.*;

/**
 * Created by pen-tpc on 2016/9/4.
 */
public class H2DbTest {
    public static void main(String[] args) {
        try {
            String sourceURL = "jdbc:h2:D:/h2db/mytestdb";// H2 database
            String user = "sa";
            String key = "";
            try {
                Class.forName("org.h2.Driver");// H2 Driver
            } catch (Exception e) {
                e.printStackTrace();
            }
            Connection conn = DriverManager.getConnection(sourceURL, user, key);
            Statement stmt = conn.createStatement();
            stmt.execute("CREATE TABLE mytable(name VARCHAR(100),sex VARCHAR(10))");
            stmt.executeUpdate("INSERT INTO mytable VALUES('Steven Stander','male')");
            stmt.executeUpdate("INSERT INTO mytable VALUES('Elizabeth Eames','female')");
            stmt.close();
            conn.close();

        } catch (SQLException sqle) {
            System.err.println(sqle);
        }
    }
}
