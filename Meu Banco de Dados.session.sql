-- Estrutura da tabela users já existente
-- CREATE TABLE users (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     username VARCHAR(255) NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     is_moderator BOOLEAN DEFAULT FALSE,
--     date_of_birth DATE NULL
--     token VARCHAR (32) NOT NULL
-- );

-- INSERT INTO users (username, password, email) VALUES ('João Silva', 'senha_hashed', 'joao@gmail.com');

-- CREATE TABLE transactions (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     user_id INT NOT NULL,
--     amount DECIMAL(10, 2) NOT NULL,
--     transaction_type ENUM('deposito', 'retirada') NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(id)
-- );

-- CREATE TABLE wallets (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     user_id INT NOT NULL,
--     balance DECIMAL(10, 2) DEFAULT 0.00,
--     bank_name VARCHAR(255),
--     agency_number VARCHAR(50),
--     account_number VARCHAR(50),
--     pix_key VARCHAR(255),
--     CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
--     CONSTRAINT unique_user_id UNIQUE (user_id)  -- Restringe duplicidade de user_id
-- );

-- CREATE TABLE events (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     date DATETIME NOT NULL,
--     status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending', -- status do evento
--     created_by INT NOT NULL, -- ID do usuário que criou o evento
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     published_at TIMESTAMP NULL, -- Data em que o evento foi publicado
--     reason_for_rejection ENUM('Texto confuso', 'Texto inapropriado', 'Não respeita a política de privacidade', 'Não respeita os termos de uso da plataforma') NULL, -- Motivo da reprovação, se aplicável
--     FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
-- );

-- CREATE TABLE event_evaluations (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     event_id INT NOT NULL,
--     moderator_id INT NOT NULL,
--     action ENUM('approve', 'reject') NOT NULL,
--     evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     reason ENUM('Texto confuso', 'Texto inapropriado', 'Não respeita a política de privacidade', 'Não respeita os termos de uso da plataforma') NULL, -- Motivo da reprovação
--     FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
--     FOREIGN KEY (moderator_id) REFERENCES users(id) ON DELETE CASCADE
-- );

-- INSERT INTO users (username, password, email, is_moderator) 
-- VALUES ('moderador1', 'senha_forte', 'moderador1@example.com', TRUE);

-- TESTE DAS TABELAS
-- INSERT INTO users (username, password, email) VALUES ('testeuser', 'senha123', 'testeuser@example.com');

-- -- Inserir uma carteira para o usuário
-- -- Considerando que o id do usuário inserido será 1 (AUTO_INCREMENT)
-- INSERT INTO wallets (user_id, balance) VALUES (1, 100.00);

SELECT * FROM events;

-- UPDATE events SET status = 'approved' WHERE status = 'finalizado';

-- UPDATE users SET is_moderator = FALSE WHERE is_moderator IS NULL;

-- DELETE FROM users WHERE id=5;

-- ALTER TABLE events
-- MODIFY COLUMN status ENUM('pending', 'approved', 'rejected', 'finalizado') DEFAULT 'pending';

-- INSERT INTO events (name, date, status, created_by) 
-- VALUES ('Evento Teste2', NOW(), 'approved', 2);

-- CREATE TABLE bets (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     event_id INT NOT NULL,
--     user_id INT NOT NULL,
--     amount DECIMAL(10, 2) NOT NULL,
--     won BOOLEAN DEFAULT FALSE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- );

-- INSERT INTO bets (event_id, user_id, amount, won) 
-- VALUES (LAST_INSERT_ID(), 1, 100, TRUE),
--        (LAST_INSERT_ID(), 2, 50, FALSE);
