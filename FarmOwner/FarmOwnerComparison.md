# Comparação de Atributos: Entidade Fazenda (Farm)

Esta tabela detalha as diferenças e o mapeamento necessário entre os atributos da entidade Fazenda no back-end e no front-end.

| Atributo (Back-end)    | Tipo (Back-end) | Atributo (Front-end) | Tipo (Front-end) | Observações / Correções Sugeridas                                                                                 | Status            |
| ---------------------- | --------------- | -------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------- |
| id                     | Long            | id                   | string           | ✅ OK: Conversão implícita para exibição.                                                                          | Consistente       |
| farmName               | String          | name                 | string           | ⚠️ Inconsistente: Mapear name (front) para farmName (back). Padronizar o nome seria o ideal.                      | Requer Mapeamento |
| location               | String          | locality             | string           | ⚠️ Inconsistente: Mapear locality (front) para location (back). Padronizar seria o ideal.                         | Requer Mapeamento |
| responsible            | String          | manager              | string           | ⚠️ Inconsistente: Mapear manager (front) para responsible (back). Nomes semanticamente alinhados.                 | Requer Mapeamento |
| responsiblePhoneNumber | String          | managerPhone         | string           | ⚠️ Inconsistente: Mapear managerPhone para responsiblePhoneNumber e ajustar validação/máscara no front.           | Requer Mapeamento |
| ownerId (via DTO)      | Long            | owner                | string           | ❌ Divergente: O front-end precisa enviar o ownerId (numérico) em vez do nome. Requer um seletor de proprietários. | Crítico           |
| businessEmail          | String          | —                    | —                | ❌ Faltando no Front-end: Adicionar o campo "E-mail Comercial" no formulário, com validação de e-mail.             | Crítico           |
| cpfCnpj                | String          | —                    | —                | ❌ Faltando no Front-end: Adicionar o campo "CPF/CNPJ" da fazenda, com máscara e validação compatíveis.            | Crítico           |
| totalAreaHectares      | Float           | area                 | string           | ⚠️ Inconsistente: Mapear area para totalAreaHectares e garantir a conversão de string para float antes do envio.  | Requer Mapeamento |
| color                  | String          | color                | string           | ✅ OK: Campo apenas para exibição no front. O back-end gerencia o valor e não deve ser enviado.                    | Apenas Leitura    |
| createdAt, updatedAt   | DateTime        | enrollmentDate       | string           | ✅ OK: Campos de metadados apenas para exibição, com nomes diferentes, mas sem impacto nos formulários.            | Apenas Leitura    |

---

Quer que eu adicione **cores ou ícones visuais (por exemplo, emojis ou badges)** para facilitar a leitura (ex: 🟢 Consistente, 🟡 Requer Mapeamento, 🔴 Crítico)? Isso deixaria a tabela mais visual.
