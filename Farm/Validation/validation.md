# Relatório de validações — Farm DTOs

Escopo
- Pacote: org.prisma.rvcarbonapi.Farm.dtos
- DTOs de entrada (request): AddMemberInFarm, CreateOrUpdateFarmRequest
- DTOs de saída (response): FarmMemberResponse, FarmResponse, FarmWithFieldsResponse, IFieldResponse (interface)

Observações gerais
- CreateOrUpdateFarmRequest usa grupos de validação (OnCreate) para obrigatoriedade em criação. Sem esse grupo (ex.: atualização), os campos marcados apenas com `groups = OnCreate.class` não são obrigatórios, mas demais constraints como `@Size`, `@Email`, `@Pattern` e `@Positive` ainda se aplicam quando o campo for enviado.
- Campos opcionais com `@Size`/`@Pattern`: preferir enviar `null` quando não alterar; `""` tende a falhar por não cumprir `min`/regex.

## AddMemberInFarm (Request)
| Campo    | Tipo     | Obrigatório | Restrições       | Mensagens                                                          |
|----------|----------|-------------|------------------|--------------------------------------------------------------------|
| username | String   | Sim         | `@NotBlank`      | "O nome de usuário (username) é obrigatório."                      |
| role     | RoleEnum | Sim         | `@NotNull`       | "A role é obrigatório."                                            |

## CreateOrUpdateFarmRequest (Request)
Regras em criação (grupo OnCreate ativo):
| Campo                   | Tipo   | Obrigatório | Restrições                                                                                      | Mensagens                                                                                                  |
|-------------------------|--------|-------------|--------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| farmName                | String | Sim         | `@NotBlank(groups=OnCreate)`, `@Size(min = 3)`                                                   | "O nome da fazenda (farmName) é obrigatório."; "… deve ter pelo menos 3 caracteres."                       |
| location                | String | Sim         | `@NotBlank(groups=OnCreate)`, `@Size(min = 2)`                                                   | "A localização (location) é obrigatória."; "… deve ter pelo menos 2 caracteres."                           |
| responsible             | String | Não         | `@Size(min = 2)`                                                                                 | "O nome do responsável (responsible) deve ter pelo menos 2 caracteres."                                    |
| responsiblePhoneNumber  | String | Sim         | `@NotBlank(groups=OnCreate)`, `@Pattern(regexp="\\d{8,9}")`                                      | "O telefone do responsável (responsiblePhoneNumber) é obrigatório."; "… deve ter 8 ou 9 dígitos."          |
| ownerId                 | Long   | Sim         | `@NotNull(groups=OnCreate)`, `@Positive`                                                         | "O id do proprietário (ownerId) é obrigatório."; "… deve ser maior que zero."                              |
| businessEmail           | String | Sim         | `@NotBlank(groups=OnCreate)`, `@Email`, `@Size(min = 3)`                                         | "O email comercial (businessEmail) é obrigatório."; "… deve ser válido."; "… deve ter pelo menos 3 caracteres." |
| cpfCnpj                 | String | Sim         | `@NotBlank(groups=OnCreate)`, `@Pattern(CPF/CNPJ formatado com pontuação)`                       | "O CPF ou CNPJ (cpfCnpj) é obrigatório."; "O CPF ou CNPJ (cpfCnpj) está em formato inválido."              |
| totalAreaHectares       | Float  | Sim         | `@NotNull(groups=OnCreate)`, `@Positive`                                                         | "A área total (totalAreaHectares) é obrigatória."; "… deve ser maior que zero."                            |

Regras em atualização (sem OnCreate):
- Nenhum campo acima é “obrigatório” pelo grupo.
- Se enviados, precisam atender:
  - `farmName`: `@Size(min = 3)`
  - `location`: `@Size(min = 2)`
  - `responsible`: `@Size(min = 2)`
  - `responsiblePhoneNumber`: `@Pattern(\d{8,9})` (evitar `""`, use `null` se não alterar)
  - `ownerId`: `@Positive` (se enviado)
  - `businessEmail`: `@Email`, `@Size(min = 3)`
  - `cpfCnpj`: `@Pattern` aceitando somente formatos com pontuação (CPF 000.000.000-00; CNPJ 00.000.000/0000-00)
  - `totalAreaHectares`: `@Positive` (se enviado)

## DTOs de saída (Response) — sem Bean Validation
- FarmMemberResponse(memberId, username, completeName, email, role) — sem validações.
- FarmResponse(…) — sem validações; apenas mapeamento do domínio (inclui lista de membros).
- FarmWithFieldsResponse(…) — sem validações; inclui listas agregadas e record interno FarmMember.
- IFieldResponse — interface marcador; sem validações.

## Diretrizes práticas para o frontend
- Criação de fazenda:
  - Exigir: `farmName (>=3)`, `location (>=2)`, `responsiblePhoneNumber (8–9 dígitos)`, `ownerId (>0)`, `businessEmail (email válido, >=3)`, `cpfCnpj (CPF/CNPJ com pontuação)`, `totalAreaHectares (>0)`.
  - `responsible` é opcional, mas se informado, `>= 2` caracteres.
- Atualização de fazenda:
  - Todos os campos opcionais; validar somente os enviados conforme suas restrições.
  - Para campos opcionais com `@Size/@Pattern`, envie `null` em vez de `""` quando não alterar.
- Formatos:
  - `responsiblePhoneNumber`: somente dígitos, tamanho 8 ou 9 (sem máscara).
  - `cpfCnpj`: somente os formatos com pontuação do regex (não aceita apenas dígitos).
