ALTER TABLE refresh_tokens RENAME COLUMN token TO token_hash;

UPDATE refresh_tokens
SET token_hash = encode(digest(token_hash, 'sha256'), 'hex');

ALTER TABLE refresh_tokens
    ALTER COLUMN token_hash TYPE VARCHAR(64);
