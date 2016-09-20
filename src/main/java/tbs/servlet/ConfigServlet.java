package tbs.servlet;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import tbs.dao.BookmarkMapper;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import static tbs.servlet.StartupServlet.sqlSessionFactory;

/**
 * Created by pen-tpc on 2016/9/3.
 */
@WebServlet("/config/*")
public class ConfigServlet extends HttpServlet {

    private static final Logger logger = Logger.getLogger(ConfigServlet.class);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        Map<String, String[]> parameterMap = req.getParameterMap();
        String result = "noMapping";
        switch (pathInfo) {
            case "/demo":
                result = "ok";
                break;
            case "/init":
                result = init(parameterMap);
                break;
        }
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();
        out.print(result);
    }

    private String init(Map<String, String[]> parameterMap) {
        SqlSession session = sqlSessionFactory.openSession();
        try {
            BookmarkMapper mapper = session.getMapper(BookmarkMapper.class);
            mapper.dynamicUpdate("DROP TABLE IF EXISTS `bookmark`;CREATE TABLE `bookmark` ( `tid` bigint NOT NULL AUTO_INCREMENT,  `id` varchar(10),  `parentId` varchar(10),  `title` varchar(200),  `url` varchar(500),  `index` int,  `dateAdded`  bigint,  PRIMARY KEY (`tid`));");
            session.commit();
            return "ok";
        } catch (Exception e) {
            session.close();
            logger.error("config init error:", e);
            return "exception";
        }
    }
}
