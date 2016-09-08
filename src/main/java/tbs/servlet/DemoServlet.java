package tbs.servlet;

import com.google.gson.Gson;
import org.apache.ibatis.session.SqlSession;
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

import static tbs.servlet.StartupServlet.sqlSessionFactory;

/**
 * Created by pen-tpc on 2016/9/3.
 */
@WebServlet("/demo")
public class DemoServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        PrintWriter out = resp.getWriter();
        out.print("Hello World!");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String json = req.getParameter("json");
        json = json.substring(1, json.length()-1);
        Gson gson = new Gson();
        Bookmark bookmark = gson.fromJson(json, Bookmark.class);
        System.out.println(bookmark);
        List<Bookmark> result = new LinkedList<>();
        parseTree(bookmark, result);
        System.out.println(result);
        SqlSession session = sqlSessionFactory.openSession();
        try {
            BookmarkMapper mapper = session.getMapper(BookmarkMapper.class);
            int count = 0;
            for (Bookmark node : result) {
                int count1 = mapper.insertOne(node);
                session.commit();
                System.out.println(count1);
                count += count1;
            }
            System.out.println(count);
        } finally {
            session.close();
        }
        PrintWriter out = resp.getWriter();
        out.print("ok");
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
}
