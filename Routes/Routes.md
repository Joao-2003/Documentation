# Tabela de Rotas da API

| Entidade | Método | Caminho | Operação | Query params | Descrição |
|---|---|---|---|---|---|
| users | GET | /api/users/search | search | username; page; size | Busca usuários pelo prefixo do username (paginado) |
| auth | POST | /api/auth/login/ | login |  | Login (gera par de tokens) |
| auth | POST | /api/auth/register/ | register |  | Registro de usuário |
| auth | POST | /api/auth/refresh/ | refresh-token |  | Renova o token (refresh) |
| auth | POST | /api/auth/logout/ | logout |  | Logout (invalida o refresh token) |
| auth | GET | /api/auth/me/ | me |  | Informações do usuário autenticado |
| auth | GET | /api/auth/confirm-email | confirm-email | token | Confirmação de e-mail via token (redireciona) |
| auth | GET | /api/auth/resend-email/ | resend-confirmation | email | Reenvia e-mail de confirmação |
| auth | POST | /api/auth/forgot-password/ | forgot-password |  | Solicitação de e-mail para reset de senha |
| auth | POST | /api/auth/reset-password/ | reset-password |  | Reset de senha |
| auth | PATCH | /api/auth/me/ | update-self |  | Atualiza dados do usuário autenticado |
| auth | POST | /api/auth/delete-account/ | request-delete-account |  | Solicita exclusão de conta (envia e-mail) |
| auth | GET | /api/auth/confirm-delete-account | confirm-delete-account | token | Confirma exclusão de conta via token (redireciona) |
| fields | POST | /api/fields/ | create |  | Cria talhão (field) |
| fields | POST | /api/fields/from-file/ | create-from-file | file; farmId | Cria talhões a partir de arquivo (upload) |
| fields | GET | /api/fields/{fieldId}/ | get-by-id |  | Busca talhão por ID |
| fields | GET | /api/fields/ | list-by-farm | page; size; farmId | Lista talhões por farmId (paginado) |
| fields | DELETE | /api/fields/{fieldId}/ | delete |  | Exclui talhão |
| fields | GET | /api/fields/{fieldId}/batches/ | list-batches | page; size | Lista batches do talhão (paginado) |
| fields | PATCH | /api/fields/{fieldId}/ | update |  | Atualiza talhão |
| owners | POST | /api/owners/ | create |  | Cria proprietário (owner) |
| owners | GET | /api/owners/{ownerId}/ | get-by-id |  | Busca proprietário por ID |
| owners | PATCH | /api/owners/{ownerId}/ | update |  | Atualiza proprietário |
| owners | DELETE | /api/owners/{ownerId}/ | delete |  | Exclui proprietário |
| owners | GET | /api/owners/ | list-mine |  | Lista proprietários do usuário autenticado |
| owners | PUT | /api/owners/{ownerId}/transfer/ | transfer |  | Transfere proprietário para outro responsável |
| owners | PUT | /api/owners/transfer-all/ | transfer-all |  | Transfere TODOS os proprietários para outro responsável |
| farms | POST | /api/farms/ | create |  | Cria fazenda |
| farms | PATCH | /api/farms/{farmId}/ | update |  | Atualiza fazenda |
| farms | GET | /api/farms/{farmId}/ | get-by-id |  | Busca fazenda por ID |
| farms | DELETE | /api/farms/{farmId}/ | delete |  | Exclui fazenda |
| farms | GET | /api/farms/ | list-mine |  | Lista fazendas do usuário autenticado |
| farms | GET | /api/farms/by-owner/{ownerId}/ | list-by-owner |  | Lista fazendas por ownerId |
| farms | POST | /api/farms/{farmId}/members/ | add-member |  | Adiciona membro na fazenda |
| farms | PATCH | /api/farms/{farmId}/members/ | update-member-role |  | Altera papel do membro na fazenda |
| farms | DELETE | /api/farms/{farmId}/members/{memberId}/ | remove-member |  | Remove membro da fazenda |
| farms | GET | /api/farms/{farmId}/members/ | list-members |  | Lista membros da fazenda |
| farms | GET | /api/farms/{farmId}/owner/ | get-owner |  | Obtém proprietário da fazenda |
| farms | GET | /api/farms/{farmId}/batches/ | list-batches | page; size | Lista batches da fazenda (paginado) |
| emissions | POST | /api/emissions/ | create |  | Cria emissão GHG para um batch |
| emissions | PATCH | /api/emissions/{emissionId}/ | update |  | Atualiza emissão GHG |
| emissions | DELETE | /api/emissions/{emissionId}/ | delete |  | Exclui emissão GHG |
| emissions | GET | /api/emissions/ | list-by-batch | batchId | Lista emissões por batchId |
| analysis | POST | /api/analysis/ | create |  | Cria análise (ARVA) para batch/field |
| analysis | PATCH | /api/analysis/{analysisId}/ | update |  | Atualiza análise |
| analysis | DELETE | /api/analysis/{analysisId}/ | delete |  | Exclui análise |
| analysis | GET | /api/analysis/{id}/ | get-by-id |  | Obtém análise por ID |
| analysis | GET | /api/analysis/mine/ | list-mine | page; size; fieldId; analysisType | Lista análises do usuário autenticado (paginado, filtros) |
| analysis | GET | /api/analysis/ | list-by-batch | batchId | Lista análises por batchId |
| analysis | GET | /api/analysis/by-field/ | list-by-field | page; size; fieldId; analysisType | Lista análises por fieldId (paginado, filtro por tipo) |
