# Comparação: Emissões GHG — Back-end vs Front-end

Esta comparação utiliza as entidades/DTOs do back-end (branch dev) e os componentes/schemas do front para GHG. Abaixo, destacamos mapeamentos, divergências e recomendações.

## Tabelas de mapeamento

### EmissionBatch (lote de emissões)

| Back-end                    | Tipo            | Front-end                               | Tipo       | Observações                                                                                 | Status          |
|----------------------------|-----------------|------------------------------------------|------------|---------------------------------------------------------------------------------------------|-----------------|
| id                         | Long            | —                                        | —          | Somente leitura; exibir como string se necessário.                                          | Consistente     |
| field (Field)              | ManyToOne       | contexto (talhão/propriedade)            | number     | Front deve enviar fieldId ao criar o batch (EmissionBatchRequest).                          | Crítico         |
| emissionBatchName          | String          | nome do lote (wizard)                    | string     | Coletar no front e enviar.                                                                   | Requer Mapeamento |
| createdAt / updatedAt      | LocalDateTime   | —                                        | —          | Leitura apenas.                                                                              | Apenas Leitura  |
| co2, ch4, n2ho, hfc, pfc, sf6, nf3 | float   | —                                        | —          | Totais calculados a partir das EmissionGHG do lote.                                         | Apenas Leitura  |
| co2eTotal, biogenicCo2Emissions, biogenicCo2Removals | float | — | — | Calculados no batch.                                                                         | Apenas Leitura  |

Endpoints relevantes:
- POST `/api/emissions/batch/` (EmissionBatchRequest: fieldId, emissionBatchName)
- GET `/api/emissions/batch/{batchId}/`
- DELETE `/api/emissions/batch/{batchId}/`

### EmissionGHG (entrada de emissão por tipo)

| Back-end               | Tipo                     | Front-end                         | Tipo            | Observações                                                                                           | Status            |
|-----------------------|--------------------------|------------------------------------|-----------------|-------------------------------------------------------------------------------------------------------|-------------------|
| id                    | Long                     | —                                  | —               | Somente leitura (retornado).                                                                           | Apenas Leitura    |
| emissionType          | Enum (EmissionGHG.Types) | tipo (passo GHG)                   | string/enum     | Front deve oferecer enum alinhado ao back.                                                             | Crítico           |
| co2 (obrigatório)     | float                    | co2                                | number          | @PositiveOrZero; obrigatório.                                                                          | Requer Mapeamento |
| ch4, n2o (n2ho em DTO), sf6, nf3 | float       | ch4, n2o, sf6, nf3                 | number          | Atenção: DTO usa `n2ho` para N2O. Mapear corretamente.                                                | Requer Mapeamento |
| emiCo2Bio, remoCo2Bio | float                    | emissões/remoções biogênicas       | number          | Validar ≥ 0.                                                                                           | Requer Mapeamento |
| hfc... (subespécies)  | float (muitos campos)    | HFCs (grupo detalhado)             | number          | Front ainda não possui formulário detalhado. Sugerir schema avançado.                                  | Faltando no Front |
| pfc... (subespécies)  | float (muitos campos)    | PFCs (grupo detalhado)             | number          | Idem HFC.                                                                                              | Faltando no Front |
| co2eT, totalBiogenicRemoval, totalCatCO2Biomassa | float | —                                 | —               | Resultados/agregações no back; leitura apenas.                                                         | Apenas Leitura    |

Endpoints relevantes:
- POST `/api/emissions` (EmissionGHGRequest)
- PUT `/api/emissions/{emissionId}/` (EmissionGHGUpdateRequest)

## Validações e constantes (Back-end)

- EmissionGHGRequest:
  - emissionBatchId: @NotNull @Positive
  - emissionType: @NotNull
  - co2: @NotNull @PositiveOrZero
  - ch4, n2ho (N2O), sf6, nf3, biogênicos, HFCs e PFCs: @PositiveOrZero
- Nomenclatura: o DTO usa `n2ho` para N2O.
- GWP: constantes em `GWPConstants` (ex.: CH4=28, N2O=265...), base para co2e.

## Situação do Front

- Já há navegação e wizard para GHG (ex.: GHGCommonData com period/manager/description), porém:
  - Ausência de tipos/schemas de emissão detalhados por gás (HFC/PFC e principais).
  - Falta de telas/fluxos para criar EmissionBatch (fieldId + emissionBatchName).
  - Falta de formulário para lançar cada EmissionGHG (emissionBatchId + gases + emissionType).

## Recomendações de adequação (Front)

1) Criar lote (EmissionBatch)
- Coletar:
  - fieldId (do contexto do talhão/propriedade)
  - emissionBatchName
- Chamar POST `/api/emissions/batch/`.

2) Registrar emissões (EmissionGHG)
- Para cada etapa/escopo/tipo (emissionType):
  - Chamar POST `/api/emissions` com emissionBatchId, emissionType, co2 (obrigatório), demais gases (>=0), biogênicos, HFCs e PFCs conforme aplicável.

3) Schemas sugeridos
- GHGCommonDataSchema (já existe no front, ajustar se necessário).
- GHGEmissionBatchSchema:
  - fieldId: number (required)
  - emissionBatchName: string (required)
- GHGEmissionSchema:
  - emissionBatchId: number (required)
  - emissionType: enum (alinhado ao back)
  - co2: number (required, >=0)
  - ch4, n2o, sf6, nf3: number (>=0)
  - emiCo2Bio, remoCo2Bio: number (>=0)
  - HFCs e PFCs detalhados: number (>=0) opcional
  - Observação: mapear `n2o` (front) → `n2ho` (DTO)

## Adapters sugeridos

```ts
// Front -> Back: criar batch
function toEmissionBatchRequest(front: { fieldId: number; emissionBatchName: string }) {
  return {
    fieldId: front.fieldId,
    emissionBatchName: front.emissionBatchName,
  };
}

// Front -> Back: criar emission GHG
function toEmissionGHGRequest(front: {
  emissionBatchId: number;
  emissionType: string;        // alinhar enum com back
  co2: number;
  ch4?: number; n2o?: number; sf6?: number; nf3?: number;
  emiCo2Bio?: number; remoCo2Bio?: number;
  // HFCs / PFCs detalhados...
}) {
  return {
    emissionBatchId: front.emissionBatchId,
    emissionType: front.emissionType as any,
    co2: front.co2,
    ch4: front.ch4 ?? 0,
    sf6: front.sf6 ?? 0,
    nf3: front.nf3 ?? 0,
    n2ho: front.n2o ?? 0,                 // ATENÇÃO ao nome esperado pelo back
    emiCo2Bio: front.emiCo2Bio ?? 0,
    remoC02Bio: front.remoCo2Bio ?? 0,
    // ...demais HFC/PFCs mapeados
  };
}
```

## Links para código

- Back-end: [EmissionGHG.java](https://github.com/prisma-rv-carbon/RvCabonApi/blob/62ed0c391ebdb36cbdc0c54462ff692017e15b35/src/main/java/org/prisma/rvcarbonapi/EmissionsGHG/EmissionGHG.java) • [EmissionBatch.java](https://github.com/prisma-rv-carbon/RvCabonApi/blob/62ed0c391ebdb36cbdc0c54462ff692017e15b35/src/main/java/org/prisma/rvcarbonapi/EmissionsGHG/EmissionBatch.java) • [GWPConstants.java](https://github.com/prisma-rv-carbon/RvCabonApi/blob/62ed0c391ebdb36cbdc0c54462ff692017e15b35/src/main/java/org/prisma/rvcarbonapi/EmissionsGHG/GWPConstants.java) • [EmissionBatchController.java](https://github.com/prisma-rv-carbon/RvCabonApi/blob/62ed0c391ebdb36cbdc0c54462ff692017e15b35/src/main/java/org/prisma/rvcarbonapi/EmissionsGHG/EmissionBatchController.java)
- Front-end: [FieldEmissionsPage.tsx](https://github.com/prisma-rv-carbon/RV-Carbon-Front-End/blob/a2bcb8b26266879a548cd3d71091f0544684fdc9/src/pages/FieldEmissionsPage.tsx) • [GHGWizard.tsx](https://github.com/prisma-rv-carbon/RV-Carbon-Front-End/blob/a2bcb8b26266879a548cd3d71091f0544684fdc9/src/forms/Protocols/GHG/GHGWizard.tsx) • [GHGCommonData.tsx](https://github.com/prisma-rv-carbon/RV-Carbon-Front-End/blob/a2bcb8b26266879a548cd3d71091f0544684fdc9/src/forms/Protocols/GHG/GHGCommonData.tsx) • [ProprietyAllEmissionsNavigate.tsx](https://github.com/prisma-rv-carbon/RV-Carbon-Front-End/blob/a2bcb8b26266879a548cd3d71091f0544684fdc9/src/forms/Emission/ProprietyAllEmission/ProprietyAllEmissionsNavigate.tsx)
