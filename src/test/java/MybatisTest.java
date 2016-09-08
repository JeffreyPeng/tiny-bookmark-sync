import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import tbs.dao.BookmarkMapper;
import tbs.domain.Bookmark;

import java.io.InputStream;
import java.util.List;

/**
 * Created by pen-tpc on 2016/9/5.
 */
public class MybatisTest {
    public static void main(String[] args) throws Exception {
        String resource = "conf/mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session = sqlSessionFactory.openSession();
        try {
            BookmarkMapper mapper = session.getMapper(BookmarkMapper.class);
            List<Bookmark> list = mapper.getAll();
            list.size();
            session.commit();
        } finally {
            session.close();
        }
    }
}
