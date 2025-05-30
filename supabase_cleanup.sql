-- 查看当前活跃连接
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    backend_start,
    state,
    state_change
FROM pg_stat_activity
WHERE 
    datname = current_database()
    AND pid <> pg_backend_pid()
    AND state = 'idle';

-- 安全地终止空闲连接（不使用 pg_terminate_backend）
SELECT pg_cancel_backend(pid)
FROM pg_stat_activity
WHERE 
    datname = current_database()
    AND pid <> pg_backend_pid()
    AND state = 'idle'
    AND state_change < now() - interval '30 minutes'; 