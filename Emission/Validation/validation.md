# Relatório de validações — Emissions GHG DTOs

Escopo
- Pacote: org.prisma.rvcarbonapi.EmissionsGhg.dtos
- DTOs de entrada (request): EmissionGHGRequest, EmissionGHGUpdateRequest
- Observação: EmissionBatchRequest está completamente comentado no código fornecido (portanto, não está ativo).

Observações gerais
- Tipos numéricos são Float (wrapper), portanto aceitam null quando não há anotações @NotNull.
- @PositiveOrZero exige valor >= 0 quando o campo é enviado; null é permitido se não houver @NotNull.
- Grupo de validação OnCreate: usado para exigir campos somente na criação.

## EmissionGHGRequest (criação)

Campos obrigatórios (grupo OnCreate)
- batchId: Long
  - @NotNull(groups = OnCreate, message = "O id da batch de emissão (batchId) é obrigatório")
  - @Positive(message = "O id da batch de emissão (batchId) precisa ser positivo")
- emissionType: EmissionGhg.Types
  - @NotNull(groups = OnCreate, message = "O valor do tipo de emissão (emissionType) não pode ser nulo")
- co2: Float
  - @NotNull(groups = OnCreate, message = "O valor de CO2 (co2) é obrigatório")
  - @PositiveOrZero(message = "O valor de CO2 (co2) não pode ser negativo")

Campos opcionais com restrição (se enviados, devem ser >= 0)
- Gases principais
  - ch4: @PositiveOrZero(message = "O valor de CH4 (ch4) não pode ser negativo")
  - sf6: @PositiveOrZero(message = "O valor de SF6 (sf6) não pode ser negativo")
  - nf3: @PositiveOrZero(message = "O valor de NF3 (nf3) não pode ser negativo")
  - n2o: @PositiveOrZero(message = "O valor de N2HO (n2o) não pode ser negativo")
  - emiCo2Bio: @PositiveOrZero(message = "O valor de emissões de CO2 biogênico (emiCo2Bio) não pode ser negativo")
  - remoCo2Bio: @PositiveOrZero(message = "O valor de remoções de CO2 biogênico (remoCo2Bio) não pode ser negativo")
- HFCs (todos com @PositiveOrZero e mensagens específicas)
  - hfc23, hfc32, hfc41, hfc125, hfc134, hfc134a, hfc143, hfc143a, hfc152, hfc152a, hfc161, hfc227ea, hfc236cb, hfc236ea, hfc236fa, hfc245ca, hfc245fa, hfc365mfc, hfc4310mee
- PFCs (todos com @PositiveOrZero e mensagens específicas)
  - pfc, pfc14, pfc116, pfc218, pfc318, pfc3110, pfc412, pfc514, pfc918
- Outros
  - trifluorometilPentafluoretoEnxofre: @PositiveOrZero(message = "O valor de Trifluorometil pentafluoreto de enxofre (trifluorometilPentafluoretoEnxofre) não pode ser negativo")
  - perfluorociclopropano: @PositiveOrZero(message = "O valor de Perfluorociclopropano (perfluorociclopropano) não pode ser negativo")

Resumo prático para frontend (Create)
- Obrigatórios: batchId (> 0), emissionType (enum válido), co2 (>= 0).
- Demais campos: opcionais; quando enviados, validar número >= 0.
- Enviar null para campos não usados; não enviar valores negativos.

## EmissionGHGUpdateRequest (atualização)

- Todos os campos são opcionais; quando enviados, devem ser >= 0 devido a @PositiveOrZero.
- Campos com @PositiveOrZero:
  - co2, ch4, sf6, nf3, n2ho, emiCo2Bio, remoC02Bio,
  - hfc (agregado geral), hfc23, hfc32, hfc41, hfc125, hfc134, hfc134a, hfc143, hfc143a, hfc152, hfc152a, hfc161, hfc227ea, hfc236cb, hfc236ea, hfc236fa, hfc245ca, hfc245fa, hfc365mfc, hfc4310mee,
  - pfc, pfc14, pfc116, pfc218, pfc318, pfc3110, pfc412, pfc514, pfc918,
  - trifluorometilPentafluoretoEnxofre, perfluorociclopropano.

Resumo prático para frontend (Update)
- Todos os campos opcionais; só validar os enviados: valor numérico >= 0.
- Prefira omitir campos não alterados (null) ao invés de enviar 0 indevidamente.

## Observações e inconsistências detectadas
- EmissionGHGUpdateRequest:
  - Campo n2ho provavelmente deveria ser n2o (há divergência com o DTO de criação).
  - Campo remoC02Bio usa “C02” (zero) no nome; no DTO de criação é remoCo2Bio (letra “o”). Isso pode causar problemas de mapeamento no front/back.
- Mensagens:
  - Em alguns campos, as mensagens incluem o nome do campo entre parênteses; mantenha a mesma chave/alias no payload para coerência com mensagens do backend.
