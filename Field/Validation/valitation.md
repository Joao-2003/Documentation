# Relatório de validações — Field DTOs

Escopo
- Pacote: org.prisma.rvcarbonapi.Field.dtos
- DTOs de entrada (request): CreateFieldRequest, UpdateFieldRequest
- DTO auxiliar: CoordinateDto
- DTO de saída (response): FieldResponse

Observações gerais
- Quando não há anotações Bean Validation em um campo, `null` é aceito (para tipos wrapper/objetos) e strings vazias só falham quando há `@NotBlank` ou restrições de tamanho/regex.
- Para validação de elementos de coleções, normalmente usa-se `@Valid` no campo da lista. Nos DTOs fornecidos, a lista `coordinates` não está anotada com `@Valid`, e `CoordinateDto` não possui restrições próprias.

## CreateFieldRequest

| Campo        | Tipo                 | Obrigatório | Restrições                                     | Mensagens                                                                 |
|--------------|----------------------|-------------|-----------------------------------------------|---------------------------------------------------------------------------|
| fieldName    | String               | Sim         | `@NotBlank`, `@Size(min = 2)`                 | "O nome do campo (fieldName) é obrigatório."; "O nome do campo (fieldName) deve ter pelo menos 2 caracteres." |
| totalAreaHec | Float                | Sim         | `@NotNull`, `@Positive`                       | "A área total (totalAreaHec) é obrigatória."; "A área total (totalAreaHec) deve ser maior que zero." |
| currentCulture | String             | Sim         | `@NotBlank`, `@Size(min = 3)`                 | "A cultura atual (currentCulture) é obrigatória."; "A cultura atual (currentCulture) deve ter pelo menos 3 caracteres." |
| season       | String               | Sim         | `@NotBlank`, `@Size(min = 3)`                 | "A safra (season) é obrigatória."; "A safra (season) deve ter pelo menos 3 caracteres." |
| coordinates  | List<CoordinateDto>  | Sim         | `@NotNull`, `@Size(min = 3)`                  | "As coordenadas (coordinates) são obrigatórias."; "No mínimo 3 coordenadas devem ser fornecidas." |
| farmId       | Long                 | Sim         | `@NotNull`, `@Positive`                       | "O id da fazenda (farmId) é obrigatório."; "O id da fazenda (farmId) deve ser um valor positivo." |

Notas:
- `coordinates`: exige ao menos 3 itens. Não há `@Valid` na lista e `CoordinateDto` não tem validações internas; portanto, apenas a quantidade e não nulidade da lista são validadas por Bean Validation.

## UpdateFieldRequest

| Campo          | Tipo                | Obrigatório | Restrições                 | Mensagens                                                                 |
|----------------|---------------------|-------------|---------------------------|---------------------------------------------------------------------------|
| fieldName      | String              | Não         | `@Size(min = 2)`          | "O nome do campo (fieldName) deve ter pelo menos 2 caracteres."          |
| totalAreaHec   | Float               | Não         | `@Positive`               | "A área total (totalAreaHec) deve ser maior que zero."                   |
| season         | String              | Não         | `@Size(min = 3)`          | "A safra (season) deve ter pelo menos 3 caracteres."                     |
| currentCulture | String              | Não         | `@Size(min = 3)`          | "A cultura atual (currentCulture) deve ter pelo menos 3 caracteres."     |
| coordinates    | List<CoordinateDto> | Não         | `@Size(min = 3)`          | "No mínimo 3 coordenadas devem ser fornecidas."                          |

Notas:
- Todos os campos são opcionais; quando presentes, devem respeitar as restrições de tamanho/positividade/quantidade.
- `coordinates`: se enviado, deve conter ao menos 3 itens (mesma observação sobre ausência de `@Valid`).

## CoordinateDto
- Campos: `Double latitude`, `Double longitude`
- Bean Validation: nenhuma anotação.
- Implicações:
  - Ambos podem ser `null` (usam `Double` wrapper).
  - Não há verificações de intervalo (ex.: latitude entre -90 e 90, longitude entre -180 e 180).

## FieldResponse
- DTO de saída com campos: id, fieldName, farmId, farmName, season, totalAreaHec, currentCulture, previousCulture, coordinates.
- Sem anotações Bean Validation (não se aplicam para resposta).

## Diretrizes práticas para o frontend
- Create:
  - Exigir: `fieldName (>=2)`, `totalAreaHec (>0)`, `currentCulture (>=3)`, `season (>=3)`, `coordinates (>=3 itens)`, `farmId (>0)`.
- Update:
  - Todos opcionais; se enviados, validar conforme as mesmas regras.
- Coordinates:
  - Recomenda-se validar no front: `latitude` não nula e em [-90, 90], `longitude` não nula e em [-180, 180].
  - Garanta pelo menos 3 pontos para formar um polígono válido (já exigido por `@Size(min=3)`).
- Strings opcionais com `@Size`: prefira enviar `null` quando não alterar; enviar `""` tende a falhar no mínimo de caracteres.
