DROP procedure IF EXISTS work_missions.test;
CREATE DEFINER=root@localhost PROCEDURE work_missions.test ( )
BEGIN
 select 'true' success;
END