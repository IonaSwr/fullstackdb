DROP procedure IF EXISTS todo.todo_add;
CREATE DEFINER=root@localhost PROCEDURE todo.todo_add ( the_data text)
BEGIN

    insert into todo.todo (data,created) values (the_data,now());
    
END