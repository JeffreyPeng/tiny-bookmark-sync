package tbs.servlet;

import com.google.gson.Gson;
import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import tbs.dao.BookmarkMapper;
import tbs.domain.Bookmark;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import static tbs.servlet.StartupServlet.sqlSessionFactory;

/**
 * Created by pengyuxiang on 2016/9/9.
 */
@WebServlet("/api/*")
public class DispatcherServlet extends HttpServlet {

    private static final Logger logger = Logger.getLogger(DispatcherServlet.class);

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        Map<String, String[]> parameterMap = req.getParameterMap();
        String result = "noMapping";
        switch (pathInfo) {
            case "/putAll":
                result = putAll(parameterMap);
                break;
            case "/getAll":
                result = getAll(parameterMap);
                break;
        }
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();
        out.print(result);
    }

    private String putAll(Map<String, String[]> parameterMap) {
        String json = parameterMap.get("json")[0];
        logger.info("json:" +  json);
        json = json.substring(1, json.length()-1);
        Gson gson = new Gson();
        Bookmark bookmark = gson.fromJson(json, Bookmark.class);
        List<Bookmark> result = new LinkedList<>();
        parseTree(bookmark, result);
        SqlSession session = sqlSessionFactory.openSession();
        try {
            BookmarkMapper mapper = session.getMapper(BookmarkMapper.class);
            int count = 0;
            for (Bookmark node : result) {
                int count1 = mapper.insertOne(node);
                session.commit();
                count += count1;
            }
            logger.info("insert count = " + count);
        } finally {
            session.close();
        }
        return "ok";
    }

    private void parseTree(Bookmark root, List<Bookmark> result) {
        if (root.children != null && root.children.length != 0) {
            for (Bookmark node : root.children) {
                parseTree(node, result);
            }
        }
        root.children = null;
        result.add(root);
    }

    private String getAll(Map<String, String[]> parameterMap) {
        String result = "";
        SqlSession session = sqlSessionFactory.openSession();
        try {
            BookmarkMapper mapper = session.getMapper(BookmarkMapper.class);
            List<Bookmark> list = mapper.getAll();
            Gson gson = new Gson();
            result = gson.toJson(list);
            logger.info("return json = " + result);
        } finally {
            session.close();
        }
        return result;
    }
}
