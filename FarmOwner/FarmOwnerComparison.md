---

# Comparação de Atributos: Entidade Proprietário (FarmOwner vs. Client)

Esta tabela detalha as diferenças e o mapeamento necessário entre os atributos da entidade **FarmOwner** no back-end e **Client** no front-end.

| Atributo (Back-end) | Tipo (Back-end) | Atributo (Front-end)    | Tipo (Front-end) | Observações / Correções Sugeridas                                                                                                    | Status            |
| ------------------- | --------------- | ----------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| name                | String          | name, surname           | String, String   | ❌ Divergente: O back-end não possui `surname`. Decidir se o front deve concatenar (“nome sobrenome”) ou se o back deve ser evoluído. | Crítico           |
| profileImageUrl     | String (URL)    | photo                   | File             | ❌ Divergente: O front manipula o arquivo e o back espera uma URL. É necessário implementar um fluxo de upload de arquivos.           | Crítico           |
| id                  | Long            | id                      | string           | ⚠️ Inconsistente: Converter o id para string no front-end ao receber os dados.                                                       | Requer Mapeamento |
| email               | String          | contactEmail            | String           | ⚠️ Inconsistente: Mapear `contactEmail` (front) para `email` (back) nas requisições.                                                 | Requer Mapeamento |
| birthDateFoundation | LocalDate       | birthDate               | string           | ⚠️ Inconsistente: Mapear nomes e garantir que o front envie a data no formato ISO (`yyyy-MM-dd`).                                    | Requer Mapeamento |
| location            | String          | locality                | String           | ⚠️ Inconsistente: Mapear `locality` (front) para `location` (back) nas requisições.                                                  | Requer Mapeamento |
| createdDate         | LocalDate       | enrollmentDate          | string           | ⚠️ Inconsistente: Mapear `createdDate` (back) para `enrollmentDate` (front) para exibição. Campo de apenas leitura.                  | Apenas Leitura    |
| userNameResponsible | String          | —                       | —                | ⚠️ Faltando no Front-end: O back-end retorna este campo, mas não existe no modelo `Client`. Avaliar necessidade de exibição.         | Faltando no Front |
| cpfCnpj             | String          | cpfCnpj                 | String           | ✅ OK: Campos alinhados em nome e tipo.                                                                                               | Consistente       |
| phone               | String          | phone                   | String           | ✅ OK: Campos alinhados em nome e tipo.                                                                                               | Consistente       |
| farms               | List            | fetchedClientProperties | Propriety[]      | ⚠️ Integração Pendente: A relação existe no back, mas a integração com a listagem de propriedades no front não está finalizada.      | Pendente          |

---

Deseja que eu una essa tabela com a anterior (Farm) em um único documento comparativo padronizado? Isso deixaria o relatório de mapeamento completo e consistente.
