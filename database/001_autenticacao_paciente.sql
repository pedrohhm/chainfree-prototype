USE chainfree;

CREATE TABLE IF NOT EXISTS autenticacao_paciente (
    paciente_id CHAR(36) NOT NULL,
    senha_hash VARCHAR(255) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    versao_termos VARCHAR(24) NOT NULL,
    termos_aceitos_em DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    consentimento_saude TINYINT NOT NULL,
    ultimo_login_em DATETIME(6) NULL,

    PRIMARY KEY (paciente_id),
    CONSTRAINT fk_autenticacao_paciente
        FOREIGN KEY (paciente_id) REFERENCES paciente (usuario_id),
    CONSTRAINT ck_autenticacao_consentimento CHECK (consentimento_saude IN (0, 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
