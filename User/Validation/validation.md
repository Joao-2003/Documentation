# Relatório de validações — User DTOs

Escopo
- Pacote: org.prisma.rvcarbonapi.User.dtos
- DTOs: UserInfo, UserSearchDTO
- Fonte: arquivos fornecidos (records Java)

Resumo
- Não há anotações de Bean Validation (@NotNull, @NotBlank, @Email, @Size, etc.).
- Não há anotações Jackson que imponham obrigatoriedade/formato (@JsonProperty(required = true), @JsonFormat, etc.).
- Não há validações em construtores/setters (records) ou validações cross-field.
- Existem apenas implicações pelo tipo (ex.: tipos primitivos não aceitam null).

## UserInfo

| Campo                 | Tipo | Bean Validation | Jackson | Outras validações | Implicações do tipo |
|-----------------------|------|-----------------|---------|-------------------|---------------------|
| totalFarmOwnerByUser  | long | nenhuma         | nenhuma | nenhuma           | não nulo (primitivo); inteiro |
| totalFarmsByUser      | long | nenhuma         | nenhuma | nenhuma           | não nulo (primitivo); inteiro |

## UserSearchDTO

| Campo           | Tipo  | Bean Validation | Jackson | Outras validações | Implicações do tipo           |
|-----------------|-------|-----------------|---------|-------------------|-------------------------------|
| id              | Long  | nenhuma         | nenhuma | nenhuma           | pode ser null (wrapper)       |
| username        | String| nenhuma         | nenhuma | nenhuma           | pode ser null                 |
| name            | String| nenhuma         | nenhuma | nenhuma           | pode ser null                 |
| email           | String| nenhuma         | nenhuma | nenhuma           | pode ser null; sem validação de formato |
| imageProfileUrl | String| nenhuma         | nenhuma | nenhuma           | pode ser null; sem validação de URL     |
