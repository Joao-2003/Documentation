# Comparação de Atributos: Usuário (User) — Back-end vs Front-end

Esta tabela consolida os atributos e os mapeamentos necessários entre o back-end (branch dev) e o front-end (schemas, tipos e formulários).

| Atributo (Back-end) | Tipo (Back-end)              | Atributo (Front-end) | Tipo (Front-end)      | Observações / Correções Sugeridas                                                                                 | Status            |
|---------------------|------------------------------|----------------------|-----------------------|-------------------------------------------------------------------------------------------------------------------|-------------------|
| id                  | Long                         | id                   | string                | ✅ OK: Exibição como string no front.                                                                             | Consistente       |
| name                | String                       | name, surname        | string, string        | ❌ Back não tem `surname`. Concatenar `name + " " + surname` no envio, ou evoluir modelo no back.                 | Crítico           |
| email               | String (único, obrigatório)  | contactEmail         | string (email)        | ⚠️ Mapear `contactEmail` → `email` e respeitar unicidade.                                                         | Requer Mapeamento |
| username            | String (único)               | —                    | —                     | ❌ Faltando nos forms do front (usuário). Necessário para registro/autenticação.                                   | Crítico           |
| password            | String                       | —                    | —                     | ❌ Faltando nos forms. Necessário no registro e reset/senha.                                                       | Crítico           |
| phone               | String                       | phone                | string                | ✅ Alinhado semanticamente.                                                                                       | Consistente       |
| cpfCnpj             | String                       | cpf                  | string                | ⚠️ Mapear `cpf` → `cpfCnpj`. Considerar máscara/validação para CNPJ também.                                       | Requer Mapeamento |
| location            | String                       | locality             | string                | ⚠️ Mapear `locality` → `location`.                                                                                | Requer Mapeamento |
| birthday            | LocalDate                    | birthDate            | string (ISO)          | ⚠️ Enviar `birthDate` como `yyyy-MM-dd`.                                                                          | Requer Mapeamento |
| training            | String                       | background           | string                | ⚠️ `background` (Formação) → `training`.                                                                          | Requer Mapeamento |
| academicTitle       | String                       | degree               | string                | ⚠️ `degree` (Título Acadêmico) → `academicTitle`.                                                                 | Requer Mapeamento |
| imageProfileUrl     | String (URL, único)          | photo                | File \| null          | ❌ Divergência: back espera URL, front tem arquivo. Criar fluxo de upload e enviar URL.                           | Crítico           |
| active              | boolean                      | —                    | —                     | ℹ️ Apenas no back. Utilizado por segurança (isEnabled).                                                           | Apenas Leitura    |
| farmOwners          | List<FarmOwner> (relação)    | —                    | —                     | ℹ️ Sem impacto direto nas telas de usuário.                                                                        | Não Aplicável     |
| color               | —                            | color                | string                | 📌 Só front (exibição).                                                                                            | Front-only        |
| items               | —                            | items                | Array<string>         | 📌 Só front (exibição).                                                                                            | Front-only        |
| enrollmentDate      | —                            | enrollmentDate       | string                | 📌 Só front (exibição).                                                                                            | Front-only        |

## Validações e Fluxos do Back-end

- Unicidade: `username` e `email` verificados em `UserService.validateUser`.
- Registro (`registerUser(AuthRegisterRequest)`): define nome, username, email, phone, password (hash), birthday, training, academicTitle, imageProfileUrl; `active=false` até ativação.
- Atualização (`updateUser(AuthUpdateRequest)`): atualiza name, phone, birthday, training, academicTitle, imageProfileUrl. Não atualiza email/username.
- Autenticação: `SecurityUser.isEnabled()` usa `active`. `getUsername()` retorna `username`.

## Adequações sugeridas no Front-end

- Registro/Perfil:
  - Incluir `username` e `password` nos formulários de registro (ou em fluxo de autenticação dedicado).
  - Mapear `contactEmail → email`, `locality → location`, `birthDate → birthday`, `background → training`, `degree → academicTitle`, `cpf → cpfCnpj`.
- Foto de perfil:
  - Implementar upload (multipart ou storage externo) para obter `imageProfileUrl`; enviar somente a URL no payload de User.
- Apresentação:
  - Manter `surname` no front; concatenar com `name` para preencher o back.
  - `color`, `items`, `enrollmentDate`: permanecer como campos somente de UI; não enviar ao back.

## Adapters sugeridos

```ts
// Front -> Back (registro)
function toRegisterUserRequest(front: {
  name: string; surname: string;
  contactEmail: string; username: string; password: string;
  phone: string; birthDate: string; background?: string; degree?: string;
  photo?: File | null; imageProfileUrl?: string; locality?: string; cpf?: string;
}) {
  return {
    name: [front.name, front.surname].filter(Boolean).join(' ').trim(),
    email: front.contactEmail,
    username: front.username,
    phone: front.phone,
    password: front.password,
    birthday: front.birthDate, // yyyy-MM-dd
    training: front.background,         // Formação
    academicTitle: front.degree,        // Título Acadêmico
    imageProfileUrl: front.imageProfileUrl ?? null, // obter via upload
    location: front.locality ?? null,
    cpfCnpj: front.cpf ?? null
  };
}

// Front -> Back (atualização)
function toUpdateUserRequest(front: {
  name: string; surname: string; phone?: string; birthDate?: string;
  background?: string; degree?: string; imageProfileUrl?: string;
}) {
  return {
    name: [front.name, front.surname].filter(Boolean).join(' ').trim(),
    phone: front.phone,
    birthday: front.birthDate, // yyyy-MM-dd
    training: front.background,
    academicTitle: front.degree,
    imageProfileUrl: front.imageProfileUrl ?? null
    // email/username não atualizados por esse endpoint
  };
}
```

## Referências diretas (código)

- Back-end: [User.java](https://github.com/prisma-rv-carbon/RvCabonApi/blob/62ed0c391ebdb36cbdc0c54462ff692017e15b35/src/main/java/org/prisma/rvcarbonapi/User/User.java) • [UserService.java](https://github.com/prisma-rv-carbon/RvCabonApi/blob/62ed0c391ebdb36cbdc0c54462ff692017e15b35/src/main/java/org/prisma/rvcarbonapi/User/UserService.java) • [UserRepository.java](https://github.com/prisma-rv-carbon/RvCabonApi/blob/62ed0c391ebdb36cbdc0c54462ff692017e15b35/src/main/java/org/prisma/rvcarbonapi/User/UserRepository.java)
- Front-end: [User.d.ts](https://github.com/prisma-rv-carbon/RV-Carbon-Front-End/blob/a2bcb8b26266879a548cd3d71091f0544684fdc9/src/types/User.d.ts) • [UserSchema.ts](https://github.com/prisma-rv-carbon/RV-Carbon-Front-End/blob/a2bcb8b26266879a548cd3d71091f0544684fdc9/src/schemas/UserSchema.ts) • [UserFormModify.tsx](https://github.com/prisma-rv-carbon/RV-Carbon-Front-End/blob/a2bcb8b26266879a548cd3d71091f0544684fdc9/src/forms/User/UserFormModify.tsx)
