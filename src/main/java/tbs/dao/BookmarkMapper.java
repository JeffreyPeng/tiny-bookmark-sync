package tbs.dao;


import tbs.domain.Bookmark;

import java.util.List;

/**
 * Created by pen-tpc on 2016/9/5.
 */
public interface BookmarkMapper {

    public List<Bookmark> getAll();

    public int insertOne(Bookmark bookmark);

    public int dynamicUpdate(String sql);
}
