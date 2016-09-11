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
import java.util.*;

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
        if (root.children != null && root.children.size() != 0) {
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
            Bookmark bookmark = buildTree(list);
            Gson gson = new Gson();
            result = gson.toJson(bookmark);
            logger.info("return json = " + result);
        } finally {
            session.close();
        }
        return result;
    }

    private Bookmark buildTree(List<Bookmark> list) {
        Map<String, Bookmark> map = new HashMap<>();
        for (Bookmark bookmark : list) {
            map.put(bookmark.id, bookmark);
        }
        Bookmark root = null;
        for (Bookmark bookmark : list) {
            if (bookmark.parentId == null) {
                root = bookmark;
            } else {
                Bookmark parent = map.get(bookmark.parentId);
                if (parent.children == null) {
                    parent.children = new LinkedList<>();
                }
                parent.children.add(bookmark);
            }
        }
        return root;
    }

    /**
     * 客户端将本地树发送服务器，进行合并（标记相对客户端新增的），之后存储该树并返回客户端
     * @param root1
     * @param root2
     */
    private void union(Bookmark root1, Bookmark root2) {
        Map<String, Bookmark> map = new HashMap();
        for (Bookmark child : root2.children) {
            map.put(child.title + child.url, child);
        }
        for (Bookmark child : root1.children) {
            Bookmark child2 = map.get(child.title + child.url);
            if (null != child2) {
                if (child2.children != null) {
                    union(child, child2);
                }
            }
            map.remove(child.title + child.url);
        }
        if (map.size() > 0) {
            root1.children.addAll(map.values());
        }
        reOrder(root1);
    }
    private void reOrder(Bookmark root) {
        Collections.sort(root.children, new Comparator<Bookmark>() {
            @Override
            public int compare(Bookmark o1, Bookmark o2) {
                if (o1.index < o2.index)
                    return -1;
                else
                    return 1;
            }
        });
        for (int i = 0; i < root.children.size(); i++) {
            root.children.get(i).index = i;
        }
    }
}
