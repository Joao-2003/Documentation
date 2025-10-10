# Comparação de Atributos: Talhão (Field) — Back-end vs Front-end

Esta tabela consolida as diferenças e mapeamentos necessários, usando o back-end (branch dev) e o front-end (schemas, tipos e formulários).

| Atributo (Back-end)        | Tipo (Back-end)                               | Atributo (Front-end) | Tipo (Front-end)      | Observações / Correções Sugeridas                                                                                                                                                    | Status          |
|----------------------------|-----------------------------------------------|----------------------|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|
| id                         | Long                                          | id                   | string                | ✅ OK: Exibição como string.                                                                                                                                                           | Consistente     |
| code                       | String (único)                                 | —                    | —                     | ❌ Faltando no Front para POST /api/fields/. Se usar /api/fields/from-file/, o back define `code = fieldName` e persiste com sufixo `_{farmId}`; getter remove sufixo na resposta.     | Crítico         |
| fieldName                  | String                                        | name                 | string                | ⚠️ Mapear `name` → `fieldName`.                                                                                                                                                       | Requer Mapeamento |
| totalAreaHec               | Float                                         | area                 | string                | ⚠️ Mapear `area` → `totalAreaHec`. Converter string→float (>0). O zod já valida formato e > 0.                                                                                        | Requer Mapeamento |
| farmId                     | Long                                          | — (via contexto)     | number                | ❌ Obrigatório. Enviar farmId numérico: em `/from-file/` via `@RequestParam`, em `/api/fields/` no corpo do request. Formulários atuais não incluem o campo explicitamente.           | Crítico         |
| coordinates                | List<{ latitude, longitude }>                 | coordinatesFile      | File \| null          | ⚠️ Divergência: front usa upload GeoJSON. Usar POST `/api/fields/from-file/` (farmId + file). Se optar por `/api/fields/`, parsear o GeoJSON e enviar `coordinates[]`.                | Requer Mapeamento |
| farmName (resposta)        | String                                        | —                    | —                     | ℹ️ Apenas leitura; sugerido exibir no front, não enviar em payload.                                                                                                                   | Apenas Leitura  |
| analyses (relação)         | List<Analysis>                                | —                    | —                     | ℹ️ Não retorna em `FieldResponse` padrão; consultar endpoints específicos por talhão quando necessário.                                                                               | Não Aplicável   |
| crop                       | —                                             | crop                 | string                | 📌 Não existe no back para Field. Manter no front para UI/negócio; avaliar migração para entidade/analysis apropriada caso seja requisito persistir.                                   | Front-only      |
| precedingCrop              | —                                             | precedingCrop        | string                | 📌 Não existe no back (Field). Mesmo tratamento de `crop`.                                                                                                                             | Front-only      |
| harvest                    | —                                             | harvest              | string                | 📌 Não existe no back (Field).                                                                                                                                                         | Front-only      |
| description                | —                                             | description          | string                | 📌 Não existe no back (Field).                                                                                                                                                         | Front-only      |
| color                      | —                                             | color                | string                | 📌 Não existe no back (Field).                                                                                                                                                         | Front-only      |
| enrollmentDate             | —                                             | enrollmentDate       | string                | 📌 Não existe no back (Field). Campo de exibição no front.                                                                                                                             | Front-only      |

## Regras/Comportamentos do Back-end

- CreateFieldRequest exige:
  - fieldName: @NotBlank
  - code: @NotBlank
  - totalAreaHec: @NotNull @Positive
  - coordinates: @Size(min=3)
  - farmId: @Positive (obrigatório)
- Sufixo em `code`:
  - @PrePersist adiciona `_{farmId}` ao persistir
  - Getter `getCode()` remove o último sufixo ao retornar (front vê o code “limpo”)
- Importação via GeoJSON (`/api/fields/from-file/`):
  - Espera `file` (.geojson) + `farmId`
  - Usa `properties.name` → `fieldName` e `properties.area` → `totalAreaHec`
  - Gera `coordinates` com o exterior do Polygon

## Adequações sugeridas no Front

- Quando usar POST `/api/fields/` (criação direta):
  - Adicionar campo `code` no form/schemas.
  - Converter `area` para float e mapear para `totalAreaHec`.
  - Incluir `farmId` (pode vir do contexto da Propriedade) no payload.
  - Fornecer `coordinates` (mín. 3 pontos) ou desabilitar esta rota se entrada for exclusivamente por arquivo.

- Quando usar POST `/api/fields/from-file/` (upload de GeoJSON):
  - Reutilizar `coordinatesFile` com `UploadFieldsFileSchema`.
  - Garantir envio de `farmId` via query/form-data.
  - Não é necessário enviar `code/totalAreaHec/coordinates` (back deriva de `name`, `area` e Polygon).

## Adapters sugeridos

```ts
// Front -> Back (rota /api/fields/)
function toCreateFieldRequest(front: {
  name: string; code: string; area: string;
  coordinates: Array<{ lat:number; lng:number }>;
  farmId: number;
}) {
  return {
    fieldName: front.name,
    code: front.code,
    totalAreaHec: parseFloat(front.area.replace(/\s/g, '').replace(',', '.')),
    coordinates: front.coordinates.map(c => ({ latitude: c.lat, longitude: c.lng })),
    farmId: front.farmId
  };
}

// Front -> Back (rota /api/fields/from-file/)
function toUploadFieldsFormData(file: File, farmId: number) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('farmId', String(farmId));
  return fd;
}

// Back -> Front (FieldResponse)
function fromFieldResponse(back: {
  id:number; code:string; fieldName:string;
  farmId:number; farmName?:string;
  coordinates: Array<{ latitude:number; longitude:number }>;
}) {
  return {
    id: String(back.id),
    code: back.code,
    name: back.fieldName,
    farmId: back.farmId,
    farmName: back.farmName,
    coordinates: back.coordinates.map(c => ({ lat: c.latitude, lng: c.longitude }))
  };
}
```

## Links úteis

- Back-end (dev): [Field.java](https://github.com/prisma-rv-carbon/RvCabonApi/blob/62ed0c391ebdb36cbdc0c54462ff692017e15b35/src/main/java/org/prisma/rvcarbonapi/Field/Field.java) • [CreateFieldRequest.java](https://github.com/prisma-rv-carbon/RvCabonApi/blob/62ed0c391ebdb36cbdc0c54462ff692017e15b35/src/main/java/org/prisma/rvcarbonapi/Field/dtos/CreateFieldRequest.java) • [FieldResponse.java](https://github.com/prisma-rv-carbon/RvCabonApi/blob/62ed0c391ebdb36cbdc0c54462ff692017e15b35/src/main/java/org/prisma/rvcarbonapi/Field/dtos/FieldResponse.java) • [FieldController.java](https://github.com/prisma-rv-carbon/RvCabonApi/blob/62ed0c391ebdb36cbdc0c54462ff692017e15b35/src/main/java/org/prisma/rvcarbonapi/Field/FieldController.java)
- Front-end: [FieldSchema.ts](https://github.com/prisma-rv-carbon/RV-Carbon-Front-End/blob/a2bcb8b26266879a548cd3d71091f0544684fdc9/src/schemas/FieldSchema.ts) • [NewFieldchema.ts](https://github.com/prisma-rv-carbon/RV-Carbon-Front-End/blob/a2bcb8b26266879a548cd3d71091f0544684fdc9/src/schemas/NewFieldchema.ts) • [UploadFieldsFileSchema.ts](https://github.com/prisma-rv-carbon/RV-Carbon-Front-End/blob/a2bcb8b26266879a548cd3d71091f0544684fdc9/src/schemas/UploadFieldsFileSchema.ts) • [Field.d.ts](https://github.com/prisma-rv-carbon/RV-Carbon-Front-End/blob/a2bcb8b26266879a548cd3d71091f0544684fdc9/src/types/Field.d.ts) • [FieldFormAdd.tsx](https://github.com/prisma-rv-carbon/RV-Carbon-Front-End/blob/a2bcb8b26266879a548cd3d71091f0544684fdc9/src/forms/Field/FieldFormAdd.tsx) • [FieldFormModify.tsx](https://github.com/prisma-rv-carbon/RV-Carbon-Front-End/blob/a2bcb8b26266879a548cd3d71091f0544684fdc9/src/forms/Field/FieldFormModify.tsx)
