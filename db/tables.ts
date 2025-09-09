export const configMaster = `create table if not exists config_master(
id int auto_increment primary key,
data_key varchar(50) not null,
value json not null,
is_active bool default true,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp
);`;

export const users = `create table if not exists users(
id int auto_increment primary key,
user_id varchar(24) not null,
name varchar(50) not null,
password text not null,
role enum ("admin","user") default "user",
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp
);`;

export const gameDbConfig =
    `create table if not exists games_db_configs(
id int auto_increment primary key,
app varchar(50) not null,
host text not null,
port int default 3306,
user text not null,
password text not null,
default_db text not null,
is_active bool default true,
created_at timestamp default current_timestamp,
updated_at timestamp  default current_timestamp on update current_timestamp
);`

export const gameDbQueries =
    `create table if not exists games_db_queries(
id int auto_increment primary key,
genre varchar (50) not null,
app varchar (64) not null,
end_point varchar (64) not null,
db_query text not null,
game_cat enum("specific", "common") default "common",
created_at timestamp default current_timestamp,
updated_at timestamp  default current_timestamp on update current_timestamp
);`;