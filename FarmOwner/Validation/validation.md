# Relatório de validações — FarmOwner DTOs

Escopo
- Pacote: org.prisma.rvcarbonapi.FarmOwner.dtos
- DTOs de entrada (request): CreateFarmOwnerRequest, UpdateFarmOwnerRequest, TransferUserResponsibleRequest
- DTOs de saída (response): FarmOwnerResponseWithoutFarm, FarmOwnerResponseWithoutUserResponsible

Observações gerais
- Campos sem anotações Bean Validation aceitam null (quando o tipo permite). Strings vazias ("") só são rejeitadas quando há @NotBlank, @Size com min > 0, ou @Pattern que não aceite vazio.
- @JsonFormat afeta o formato esperado na serialização/desserialização de data, não é validação em si, mas impacta o front.
- As respostas usam @JsonInclude(Include.NON_NULL), logo campos nulos podem ser omitidos no JSON de resposta.

## CreateFarmOwnerRequest

| Campo               | Tipo      | Obrigatório | Restrições                                                                                                   | Formato       | Mensagens                                                                                                  |
|---------------------|-----------|-------------|---------------------------------------------------------------------------------------------------------------|---------------|------------------------------------------------------------------------------------------------------------|
| name                | String    | Sim         | @NotBlank, @Size(min = 3, max = 150)                                                                          | —             | "O nome (name) é obrigatório."; "O nome (name) deve ter entre 3 e 150 caracteres."                         |
| cpfCnpj             | String    | Sim         | @NotBlank, @Pattern(CPF/CNPJ formatado)                                                                       | —             | "O CPF ou CNPJ (cpfCnpj) é obrigatório."; "O CPF ou CNPJ (cpfCnpj) está em formato inválido."              |
| phone               | String    | Não         | @Pattern(regexp = "\\d{8,9}")                                                                                 | —             | "O telefone (phone) deve ter 8 ou 9 dígitos."                                                              |
| location            | String    | Sim         | @NotBlank, @Size(min = 2)                                                                                     | —             | "A localidade (location) é obrigatória."; "A localidade (location) deve ter pelo menos 2 caracteres."      |
| email               | String    | Sim         | @NotBlank, @Email, @Size(min = 5)                                                                             | —             | "O e-mail (email) é obrigatório."; "O e-mail (email) deve ser válido."; "… deve ter pelo menos 5 caracteres." |
| birthDateFoundation | LocalDate | Sim         | @NotNull, @Past                                                                                                | (padrão Jackson) | "A data de nascimento ou fundação (birthDateFoundation) é obrigatória."; "… deve estar no passado."        |
| profileImageUrl     | String    | Não         | @Size(min = 5)                                                                                                 | —             | "A URL da imagem de perfil (profileImageUrl) deve ter pelo menos 5 caracteres."                             |

Notas:
- cpfCnpj: formatos aceitos exatamente com pontuação — CPF 000.000.000-00 ou CNPJ 00.000.000/0000-00.
- phone: opcional; se enviado, deve ter somente dígitos e tamanho 8 ou 9 (sem máscara).
- birthDateFoundation: sem @JsonFormat; o formato de data esperado segue a configuração padrão do Jackson (tipicamente ISO yyyy-MM-dd, a menos que exista configuração global diferente).

## UpdateFarmOwnerRequest

| Campo               | Tipo      | Obrigatório | Restrições                                       | Formato        | Mensagens                                                                                   |
|---------------------|-----------|-------------|---------------------------------------------------|----------------|---------------------------------------------------------------------------------------------|
| name                | String    | Não         | @Size(min = 3, max = 150)                         | —              | "O nome (name) deve ter entre 3 e 150 caracteres."                                         |
| cpfCnpj             | String    | Não         | @Pattern(CPF/CNPJ formatado)                      | —              | "O CPF ou CNPJ (cpfCnpj) está em formato inválido."                                        |
| phone               | String    | Não         | @Pattern(regexp = "\\d{8,9}")                     | —              | "O telefone (phone) deve ter 8 ou 9 dígitos."                                              |
| location            | String    | Não         | @Size(min = 2)                                    | —              | "A localidade (location) deve ter pelo menos 2 caracteres."                                |
| email               | String    | Não         | @Email, @Size(min = 5)                            | —              | "O e-mail (email) deve ser válido."; "O e-mail (email) deve ter pelo menos 5 caracteres."  |
| birthDateFoundation | LocalDate | Não         | @Past                                             | dd/MM/yyyy     | "A data de nascimento ou fundação (birthDateFoundation) deve estar no passado."            |
| profileImageUrl     | String    | Não         | @Size(min = 5)                                    | —              | "A URL da imagem de perfil (profileImageUrl) deve ter pelo menos 5 caracteres."            |

Notas:
- @JsonFormat(shape = STRING, pattern = "dd/MM/yyyy") em birthDateFoundation: o front deve enviar datas como "31/12/1999".
- Todos os campos são opcionais; se enviados, precisam respeitar as respectivas restrições.
- Para campos opcionais com @Size/@Pattern, enviar "" tende a falhar; prefira omitir (null) quando não alterar.

## TransferUserResponsibleRequest
- userResponsibleUserName: String — sem anotações de validação; opcional.

## DTOs de saída (Response) — sem validações Bean Validation
- FarmOwnerResponseWithoutFarm: utiliza @JsonInclude(Include.NON_NULL); mapeia de FarmOwner.
- FarmOwnerResponseWithoutUserResponsible: utiliza @JsonInclude(Include.NON_NULL); mapeia de FarmOwner (inclui List<FarmResponse>).

## Diretrizes práticas para o frontend
- Criação (CreateFarmOwnerRequest):
  - Exigir: name (3–150), cpfCnpj (formatado), location (>=2), email (válido, >=5), birthDateFoundation (passado; formato Jackson padrão).
  - Opcionais: phone (8–9 dígitos), profileImageUrl (>=5).
- Atualização (UpdateFarmOwnerRequest):
  - Campos todos opcionais; se presentes, validar como acima.
  - birthDateFoundation deve ser enviado como dd/MM/yyyy e estar no passado.
- Strings opcionais com @Size/@Pattern: omitir ao invés de enviar "" para evitar falhas.
- cpfCnpj: sempre com pontuação conforme regex (não aceita somente dígitos sem máscara).
