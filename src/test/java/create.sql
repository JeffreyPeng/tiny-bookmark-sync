DROP TABLE IF EXISTS `bookmark`;
CREATE TABLE `bookmark` (
  `tid` bigint NOT NULL AUTO_INCREMENT,
  `id` varchar(10),
  `parentId` varchar(10),
  `title` varchar(200),
  `url` varchar(500),
  `index` int,
  `dateAdded`  bigint,
  PRIMARY KEY (`tid`)
);