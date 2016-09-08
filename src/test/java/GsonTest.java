import com.google.gson.Gson;
import tbs.domain.Bookmark;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by pen-tpc on 2016/9/3.
 */
public class GsonTest {
    public static void main(String[] args) {
        Gson gson = new Gson();
        String json = "{\n" +
                "            \"dateAdded\": 1411022903921,\n" +
                "            \"id\": \"6\",\n" +
                "            \"index\": 0,\n" +
                "            \"parentId\": \"1\",\n" +
                "            \"title\": \"\",\n" +
                "            \"url\": \"chrome-extension://fdmmgilgnpjigdojojpjoooidkmcomcm/index.html\"\n" +
                "          }";
        long d = 1411022903921L;
        Date date = new Date(d);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        System.out.println(sdf.format(new Date()));
        System.out.println(sdf.format(date));
        Bookmark bookmark = gson.fromJson(json, Bookmark.class);
        System.out.println(bookmark);
    }
}
