package tbs.domain;

import java.util.List;

/**
 * Created by pen-tpc on 2016/9/3.
 */
public class Bookmark {
    public Long tid;
    public String id;
    public String parentId;
    public String title;
    public String url;
    public Integer index;
    public Long dateAdded;
    public List<Bookmark> children;

}
