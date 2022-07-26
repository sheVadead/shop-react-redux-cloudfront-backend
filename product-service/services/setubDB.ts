export default `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

drop table if exists stocks, products;

CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY key,
	photo_id VARCHAR ( 50 ),
	title VARCHAR ( 50 ) UNIQUE,
	description VARCHAR ( 222 ),
	price INT
);

CREATE TABLE stocks (
	product_id UUID primary KEY,
	"count" INT            
);

ALTER TABLE stocks 
        ADD FOREIGN KEY (product_id) REFERENCES products (id) on delete cascade on update cascade
                DEFERRABLE INITIALLY DEFERRED;

               INSERT INTO public.products
(id, title, description, price, photo_id)
values
(uuid_generate_v4(),'Fanta', 'Bright, bubbly and popular, Fanta is the soft drink that intensifies fun', 2.4, 'photo-1632818924360-68d4994cfdb2'),
(uuid_generate_v4(),'Coca-cola', 'Carbonated soft drink', 2.7, 'photo-1554866585-cd94860890b7'),
(uuid_generate_v4(),'Pepsi', 'Simply and tasty', 2, 'photo-1629203851122-3726ecdf080e'),
(uuid_generate_v4(),'Monster', 'One of the leading Soft drink brand in Thailand', 1.4, 'photo-1648147640301-c9fa3e52c3b1'),
(uuid_generate_v4(),'7up', 'Lemon-lime-flavored non-caffeinated soft drink', 1.5, 'photo-1624517286326-62fc932dffca'),
(uuid_generate_v4(),'Schweppes', 'Worlds original soft drink that offers a range of delicately-balanced creations with ingredients selected with care', 3, 'photo-1581006852262-e4307cf6283a'),
(uuid_generate_v4(),'Mountain dew', 'Isotonic drinks', 1, 'photo-1632161927166-0aea13d8f7e6'),
(uuid_generate_v4(),'Sprite', 'lemon-lime flavoured soft drink with a crisp', 2.6, 'photo-1592860893757-84536a1c9b82') RETURNING id;

do $$
  declare
    product_to_insert record;
  begin
    for product_to_insert in
      select id from products
    loop
    	INSERT INTO stocks (product_id, "count") values (product_to_insert.id, (SELECT  floor(random() * 10 + 20)));
    end loop;
  end;
$$;
`