package tbs.servlet;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.apache.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import java.io.InputStream;

/**
 * Created by pen-tpc on 2016/9/6.
 */
@WebServlet(loadOnStartup = 1, urlPatterns = {"/loadOnStartup_not_use"})
public class StartupServlet extends HttpServlet {

    private static final Logger logger = Logger.getLogger(StartupServlet.class);

    public static SqlSessionFactory sqlSessionFactory;

    @Override
    public void init() throws ServletException {
        logger.info("init start ...");
        try {
            String resource = "conf/mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        } catch (Exception e) {
            logger.error("init error :", e);
        }

    }
}
