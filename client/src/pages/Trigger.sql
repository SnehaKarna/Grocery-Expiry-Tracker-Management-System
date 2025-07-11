CREATE TABLE user_products (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    quantity INT,
    purchase_date DATE
);

INSERT INTO user_products (user_id, product_id, quantity, purchase_date)
VALUES (1, 1, 2, '2025-05-30');


SELECT * FROM user_products;
SELECT quantity FROM user_products WHERE user_id = 1;
