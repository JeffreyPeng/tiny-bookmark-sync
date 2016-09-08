package tbs.servlet;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import java.io.InputStream;

/**
 * Created by pen-tpc on 2016/9/6.
 */
@WebServlet(loadOnStartup=1,urlPatterns={"/loadOnStartup_not_use"})
public class StartupServlet extends HttpServlet {
    public static SqlSessionFactory sqlSessionFactory;
    @Override
    public void init() throws ServletException {
        System.out.println("init all ... ");
        try {
            String resource = "conf/mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
