# Relatório de validações — Security DTOs

Escopo
- Pacote: `org.prisma.rvcarbonapi.Security.dtos`
- DTOs de entrada (request): `AuthLoginRequest`, `AuthRegisterRequest`, `AuthForgotPassword`, `AuthResetPasswordRequest`, `AuthUpdateRequest`, `RefreshRequest`, `RequestDeleteAccount`
- DTOs de saída (response): `AuthResponse`, `JwtTokenPair`, `AuthRegisterResponse`, `AuthErrorResponse`, `UserInfosResponse`
- Interface marcador: `AuthDto`

Observações gerais
- Onde não há anotações de validação (Bean Validation), o campo é aceito como `null` (quando o tipo permite). Contudo, se houver `@Size` ou `@Pattern` sem `@NotBlank`, valores em branco (`""`) tendem a falhar (por não atenderem a `min` ou ao regex), enquanto `null` passa.
- `@JsonFormat` indica o formato esperado de data na serialização/desserialização JSON.

## DTOs de entrada (Request)

### AuthLoginRequest
| Campo            | Tipo   | Obrigatório | Restrições                                      | Formato | Mensagens                                                                 |
|------------------|--------|-------------|--------------------------------------------------|---------|---------------------------------------------------------------------------|
| loginIdentifier  | String | Sim         | `@NotBlank`                                      | —       | "O e-mail ou username é obrigatório."                                     |
| password         | String | Sim         | `@NotBlank`, `@Size(min = 6)`                    | —       | `@NotBlank`: padrão; `@Size`: "A senha deve ter ao menos 6 caracteres"    |

### AuthRegisterRequest
| Campo           | Tipo      | Obrigatório | Restrições                                                                                                   | Formato           | Mensagens                                                                                                                                               |
|----------------|-----------|-------------|---------------------------------------------------------------------------------------------------------------|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| name           | String    | Sim         | `@NotBlank`, `@Size(min = 3)`                                                                                | —                 | "O nome (name) é obrigatório."; "O nome (name) deve ter pelo menos 3 caracteres."                                                                       |
| email          | String    | Sim         | `@NotBlank`, `@Email`, `@Size(min = 5)`                                                                      | —                 | "O email (email) é obrigatório."; "O email (email) deve ser válido."; "O email (email) deve ter pelo menos 5 caracteres."                               |
| phone          | String    | Não         | `@Pattern(regexp = "\\d{11}")`                                                                               | —                 | "O telefone (phone) deve ter 11 dígitos." — opcional; se informado, deve conter exatamente 11 dígitos (apenas números).                                 |
| username       | String    | Sim         | `@NotBlank`, `@Size(min = 3, max = 30)`                                                                      | —                 | "O nome de usuário (username) é obrigatório."; "O nome de usuário (username) deve ter entre 3 e 30 caracteres."                                         |
| password       | String    | Sim         | `@NotBlank`, `@Size(min = 6)`                                                                                | —                 | "A senha (password) é obrigatória."; "A senha (password) deve ter no mínimo 6 caracteres."                                                               |
| birthday       | LocalDate | Sim         | `@Past`, `@NotNull`                                                                                          | `dd/MM/yyyy`      | "A data de nascimento (birthday) deve estar no passado."; "A data de nascimento (birthday) é obrigatória."                                              |
| location       | String    | Sim         | `@NotBlank`, `@Size(min = 2)`                                                                                | —                 | "A localização (location) é obrigatória."; "A localização (location) deve ter pelo menos 2 caracteres."                                                 |
| cpfCnpj        | String    | Sim         | `@NotBlank`, `@Pattern(CPF/CNPJ formatado)`                                                                  | —                 | "O CPF ou CNPJ (cpfCnpj) é obrigatório."; "O CPF ou CNPJ (cpfCnpj) está em formato inválido." Formatos aceitos: CPF `000.000.000-00` ou CNPJ `00.000.000/0000-00`. |
| degree         | String    | Não         | `@Size(min = 2)`                                                                                             | —                 | "O grau de formação (degree) deve ter pelo menos 2 caracteres."                                                                                         |
| academicTitle  | String    | Não         | `@Size(min = 2)`                                                                                             | —                 | "O título acadêmico (academicTitle) deve ter pelo menos 2 caracteres."                                                                                  |
| imageProfileUrl| String    | Não         | `@Size(min = 5)`                                                                                             | —                 | "A URL da imagem de perfil (imageProfileUrl) deve ter pelo menos 5 caracteres."                                                                         |

### AuthForgotPassword
| Campo | Tipo   | Obrigatório | Restrições                   | Formato | Mensagens                           |
|-------|--------|-------------|------------------------------|---------|-------------------------------------|
| email | String | Sim         | `@NotBlank`, `@Email`        | —       | "O e-mail é obrigatório"; "O e-mail deve ser válido" |

### AuthResetPasswordRequest
| Campo       | Tipo   | Obrigatório | Restrições                | Formato | Mensagens                                                                |
|-------------|--------|-------------|---------------------------|---------|--------------------------------------------------------------------------|
| token       | String | Sim         | `@NotBlank`               | —       | `@NotBlank`: padrão                                                       |
| newPassword | String | Sim         | `@NotBlank`, `@Size(6+)`  | —       | "A nova senha (newPassword) deve ter ao menos 6 caracteres"              |

### AuthUpdateRequest
| Campo           | Tipo      | Obrigatório | Restrições                                  | Formato      | Mensagens                                                                 |
|----------------|-----------|-------------|----------------------------------------------|--------------|---------------------------------------------------------------------------|
| name           | String    | Não         | `@Size(min = 3)`                             | —            | "O nome (name) deve ter pelo menos 3 caracteres."                         |
| phone          | String    | Não         | `@Pattern(regexp = "\\d{11}")`               | —            | "O telefone (phone) deve ter 11 dígitos."                                 |
| location       | String    | Sim         | `@NotBlank`, `@Size(min = 2)`                | —            | "A localização (location) é obrigatória."; "… deve ter pelo menos 2…"     |
| birthday       | LocalDate | Não         | `@Past`                                      | `dd/MM/yyyy` | "A data de nascimento (birthday) deve estar no passado."                  |
| degree         | String    | Não         | `@Size(min = 2)`                             | —            | "O grau de formação (degree) deve ter pelo menos 2 caracteres."           |
| academicTitle  | String    | Não         | `@Size(min = 2)`                             | —            | "O título acadêmico (academicTitle) deve ter pelo menos 2 caracteres."    |
| imageProfileUrl| String    | Não         | `@Size(min = 5)`                             | —            | "A URL da imagem de perfil (imageProfileUrl) deve ter pelo menos 5…"      |

Notas:
- Campos opcionais com `@Size`/`@Pattern`: `null` é permitido; vazio `""` tende a ser inválido (não atende ao `min`/regex).

### RefreshRequest
| Campo        | Tipo   | Obrigatório | Restrições     | Formato | Mensagens                            |
|--------------|--------|-------------|----------------|---------|--------------------------------------|
| refreshToken | String | Sim         | `@NotBlank`    | —       | "O refreshToken é obrigatório."      |

### RequestDeleteAccount
| Campo | Tipo   | Obrigatório | Restrições                   | Formato | Mensagens                           |
|-------|--------|-------------|------------------------------|---------|-------------------------------------|
| email | String | Sim         | `@NotBlank`, `@Email`        | —       | "O e-mail é obrigatório"; "O e-mail deve ser válido" |

## DTOs de saída (Response) — sem validações Bean Validation
- `AuthResponse(token, tokenType)` — sem anotações de validação.
- `JwtTokenPair(token, refreshToken, tokenType)` — sem anotações de validação.
- `AuthRegisterResponse(...)` — mapeia de `User`; sem anotações de validação.
- `AuthErrorResponse(details)` — sem anotações de validação.
- `UserInfosResponse(...)` — agregado de `User` e `UserInfo`; sem anotações de validação.
- `AuthDto` — interface marcador.

## Regras práticas para o frontend
- Campos obrigatórios por fluxo:
  - Login: `loginIdentifier`, `password (>= 6)`
  - Registro: `name (>=3)`, `email (email válido, >=5)`, `username (3–30)`, `password (>=6)`, `birthday (dd/MM/yyyy e passado)`, `location (>=2)`, `cpfCnpj (CPF/CNPJ formatado)`. Opcionais: `phone` (11 dígitos), `degree (>=2)`, `academicTitle (>=2)`, `imageProfileUrl (>=5)`.
  - Esqueci a senha: `email` válido.
  - Reset de senha: `token`, `newPassword (>=6)`.
  - Atualização de perfil: `location (>=2)` é obrigatório; demais campos opcionais seguem seus mínimos/padrões.
  - Refresh token: `refreshToken` obrigatório.
  - Deletar conta: `email` válido.
- Formatos:
  - `birthday`: `dd/MM/yyyy` (ex.: 31/12/1999).
  - `cpfCnpj`: somente nos formatos com pontuação: CPF `000.000.000-00` ou CNPJ `00.000.000/0000-00`.
  - `phone`: exatamente 11 dígitos numéricos (sem máscara).
- Opcionais:
  - Prefira omitir (`null`) em vez de enviar `""` para campos opcionais com mínimo/regex; enviar vazio causará erro de validação.
