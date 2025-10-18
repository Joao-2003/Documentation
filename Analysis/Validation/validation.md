# Relatório de validações — Analysis ARVA DTOs

Escopo
- Pacote: `org.prisma.rvcarbonapi.AnalysisArva.dtos`
- Base comum: `DataAnalysisBaseRequest` (embutido via `@JsonUnwrapped` e validado com `@Valid` em todos os DTOs de análise)
- DTOs cobertos:
  - ConservationProgramRequest
  - CoverCroppingRequest
  - CropCorrectiveApplicationRequest
  - CropProtectionApplicationRequest
  - EnergyAndFuelRequest
  - FertilizerApplicationRequest
  - HarvestRequest
  - IrrigationAnalysisRequest
  - ManagementGrazingRequest
  - PlantingOperationRequest
  - PrecisionAgricultureRequest
  - SoilPreparationRequest
  - SoilSampleAnalysisRequest
- Observação: `ARVABatchRequest` está comentado (inativo).

Observações gerais
- Várias obrigatoriedades estão condicionadas ao grupo de validação `OnCreate`. Em atualizações (sem `OnCreate`), esses campos deixam de ser obrigatórios, mas outras restrições (ex.: `@Size`, `@PositiveOrZero`, `@Email`, `@Pattern`) ainda se aplicam aos campos enviados.
- Tipos primitivos (ex.: `int`, `float`, `boolean`) não aceitam `null` e tendem a receber valor padrão (ex.: `0`, `false`) na desserialização. Se houver validação como `@Positive`, o padrão `0` falha — na prática, torna o campo “obrigatório” com valor válido.
- Datas:
  - `startDate` e `endDate` no `DataAnalysisBaseRequest` usam `@JsonFormat(pattern = "dd/MM/yyyy")` e `@PastOrPresent` (não podem ser futuras).
- Polimorfismo:
  - `IAnalysisBaseRequest` usa `@JsonTypeInfo` com `property = "analysisType"` e um `JsonTypeIdResolver` custom para escolher o subtipo correto a partir do campo `analysisType`.

## DataAnalysisBaseRequest (baseRequest)
Campos e validações (aplicáveis a todos os requests que o contém)

- batchId: Long
  - @NotNull(groups = OnCreate, message = "O identificador da batch (batchId) é obrigatório.")
  - @Positive(message = "O identificador da batch (batchId) deve ser maior que zero.")
- notes: String
  - @Size(min = 3, message = "As observações (notes) devem ter pelo menos 3 caracteres.")
- startDate: LocalDate
  - @NotNull(groups = OnCreate, message = "A data de início (startDate) é obrigatória.")
  - @PastOrPresent(message = "A data de início (startDate) não pode ser futura.")
  - @JsonFormat(shape = STRING, pattern = "dd/MM/yyyy")
- endDate: LocalDate
  - @PastOrPresent(message = "A data de término (endDate) não pode ser futura.")
  - @JsonFormat(shape = STRING, pattern = "dd/MM/yyyy")
- attachments: SingleOrListWrapper<String>
  - Sem anotações; opcional.
- analysisType: AnalysisType
  - @NotNull(groups = OnCreate, message = "O tipo de análise (analysisType) é obrigatório.")
- collectedBy: String
  - @Size(min = 2, message = "O nome de quem coletou (collectedBy) deve ter pelo menos 2 caracteres.")

Implicação para o frontend
- Em criação (OnCreate): exigir `batchId`, `startDate`, `analysisType` e validar formato/temporalidade das datas.
- Em atualização: `batchId`, `startDate` e `analysisType` tornam-se opcionais, mas se enviados, ainda devem ser válidos.

## ConservationProgramRequest
- baseRequest: `@Valid` (aplica todas as validações do `DataAnalysisBaseRequest`)
- rccp: Boolean — sem validação (as anotações `@NotNull` estão comentadas)
- cscg: Boolean — sem validação
- csp: Boolean — sem validação
- practices: Boolean — sem validação
- noDeforestation: Boolean — sem validação
- carbonCredit: Boolean — sem validação
- otherScope: Boolean — sem validação
- biodiversity: Boolean — sem validação

Frontend
- Todos os booleanos são opcionais no backend atual (podem ser omitidos ou `null`).

## CoverCroppingRequest
- baseRequest: `@Valid`
- cropType: CoverCropping.CropType
  - @NotNull(groups = OnCreate, message = "O tipo de cultura (cropType) é obrigatório")
- coverCroppingFamily: CoverCropping.CoverCroppingFamily — opcional (NotNull comentado)
- isInterspersed: Boolean — opcional

Frontend
- Em criação: `cropType` obrigatório; demais opcionais.

## CropCorrectiveApplicationRequest
- baseRequest: `@Valid`
- correctiveType: CropCorrectiveApplication.CorrectiveType — opcional (NotNull comentado)
- quantity: Float
  - @PositiveOrZero(message = "A quantidade (quantity) deve ser maior ou igual a zero")

Frontend
- `quantity` é opcional; se enviado, deve ser >= 0.

## CropProtectionApplicationRequest
- baseRequest: `@Valid`
- unity: CropProtectionApplication.Unity
  - @NotNull(groups = OnCreate, message = "A unidade de aplicação (unity) é obrigatória")
- productName: String — opcional
- rate: Float
  - @PositiveOrZero(message = "A taxa de aplicação (rate) deve ser maior ou igual a zero")
- cost: Float
  - @PositiveOrZero(message = "O custo (cost) deve ser maior ou igual a zero")
- pestControlType: CropProtectionApplication.PestControlType — opcional
- applicationMethod: CropProtectionApplication.ApplicationMethod — opcional
- isForPestControl: Boolean — opcional
- isForDiseaseControl: Boolean — opcional
- isForWeedControl: Boolean — opcional

Frontend
- Em criação: `unity` obrigatório; `rate`/`cost` se enviados, >= 0; demais opcionais.

## EnergyAndFuelRequest
- baseRequest: `@Valid`
- diesel: Float — @Min(0, "O consumo de diesel (diesel) não pode ser negativo")
- gasoline: Float — @Min(0, "O consumo de gasolina (gasoline) não pode ser negativo")
- naturalGas: Float — @Min(0, "O consumo de gás natural (naturalGas) não pode ser negativo")
- lpg: Float — @Min(0, "O consumo de GLP (lpg) não pode ser negativo")
- electricityKw: Float — @Min(0, "O consumo de eletricidade em kW (electricityKw) não pode ser negativo")

Frontend
- Todos opcionais; se enviados, `>= 0`.

## FertilizerApplicationRequest
- baseRequest: `@Valid`
- rate: Float — @PositiveOrZero("A taxa de aplicação (rate) deve ser maior ou igual a zero")
- cost: Float — sem validação (anotação comentada)
- unity: FertilizerApplication.Unity — opcional
- productName: String — opcional
- applicationMethod: FertilizerApplication.ApplicationMethod — opcional
- hasFertilityPlan: Boolean — opcional
- isPrecisionApplication: Boolean — opcional
- isVariableRate: Boolean — opcional
- n: Float — @PositiveOrZero("O nitrogênio (n) deve ser maior ou igual a zero")
- p: Float — @PositiveOrZero("O fósforo (p) deve ser maior ou igual a zero")
- k: Float — @PositiveOrZero("O potássio (k) deve ser maior ou igual a zero")
- s: Float — @PositiveOrZero("O enxofre (s) deve ser maior ou igual a zero")
- inhibitor: Boolean — opcional
- slowRelease: Boolean — opcional

Frontend
- Se enviados, `rate`, `n`, `p`, `k`, `s` devem ser `>= 0`. `cost` está sem validação no backend atual.

## HarvestRequest
- baseRequest: `@Valid`
- cropType: Harvest.CropType — opcional
- harvestType: Harvest.HarvestType — opcional
- unity: Harvest.Unity — opcional
- residueRemovalCount: int (primitivo) — @PositiveOrZero("O número de remoções de resíduo (residueRemovalCount) não pode ser negativo")
- residueBurning: boolean (primitivo) — sem validação
- yield: float (primitivo) — @Positive("A produtividade (yield) deve ser positiva")

Frontend
- `yield` precisa ser > 0 (por ser primitivo e `@Positive`, `0` falha — na prática, exigido).
- `residueRemovalCount` deve ser >= 0.

## IrrigationAnalysisRequest
- baseRequest: `@Valid`
- method: IrritationMethods — opcional
- quantity: float (primitivo) — @PositiveOrZero("A quantidade de irrigação (quantity) deve ser maior ou igual a zero")
- unity: Irrigation.Unity — opcional
- drainage: float (primitivo) — @PositiveOrZero("A drenagem (drainage) deve ser maior ou igual a zero")
- waterSourceType: WaterSourceType — opcional
- irrigationCategory: IrrigationCategory — opcional

Frontend
- Campos numéricos primitivos `quantity` e `drainage` devem ser `>= 0`.

## ManagementGrazingRequest
- baseRequest: `@Valid`
- stockingRate: float (primitivo) — @Positive("A taxa de lotação (stockingRate) deve ser positiva")
- animalType: ManagementGrazing.AnimalType — opcional

Frontend
- `stockingRate` deve ser > 0 (por ser primitivo com `@Positive`, `0` falha — efetivamente obrigatório).

## PlantingOperationRequest
- baseRequest: `@Valid`
- seedsPerBeg: int (primitivo) — @PositiveOrZero("A quantidade de sementes (seedsPerBeg) deve ser maior ou igual a zero")
- costPerBeg: Float — sem validação (anotação comentada)
- unity: PlantingOperation.Unity — opcional
- brand: String — opcional
- plantingRate: Float — sem validação (anotação comentada)
- cultivationType: PlantingOperation.CultivationType — opcional
- hybridVariation: String — opcional
- biologicals: String — opcional

Frontend
- `seedsPerBeg` deve ser `>= 0`; os demais, conforme negócio (backend não valida `costPerBeg`/`plantingRate` no momento).

## PrecisionAgricultureRequest
- baseRequest: `@Valid`
- sectionControl: Boolean — opcional
- managementSoftware: Boolean — opcional
- opticalSensors: Boolean — opcional
- autotracAutosteer: Boolean — opcional

Frontend
- Todos opcionais.

## SoilPreparationRequest
- baseRequest: `@Valid`
- depth: Float — @Positive("A profundidade (depth) deve ser positiva")
- implementUsed: SoilPreparation.ImplementTypes — opcional
- tillagePractice: SoilPreparation.TillagePracticeTypes — opcional

Frontend
- Se enviado, `depth` deve ser > 0.

## SoilSampleAnalysisRequest
- baseRequest: `@Valid`
- soilSampleType: SoilSampleAnalysis.SoilSampleType
  - @NotNull(groups = OnCreate, message = "O tipo de amostra (soilSampleType) é obrigatório")

Frontend
- Em criação: `soilSampleType` é obrigatório.

## ARVABatchRequest (inativo)
- Arquivo completamente comentado; sem validações vigentes.

## Resumo prático (Create — campos mínimos por tipo)
- Sempre: validar `baseRequest` (OnCreate) — `batchId` (>0), `startDate` (dd/MM/yyyy, passado/presente), `analysisType` (compatível com o subtipo enviado).
- ConservationProgram: sem obrigatórios específicos (todos booleanos opcionais).
- CoverCropping: `cropType` obrigatório.
- CropCorrectiveApplication: nenhum obrigatório específico; se enviado, `quantity >= 0`.
- CropProtectionApplication: `unity` obrigatório; `rate`/`cost >= 0` se enviados.
- EnergyAndFuel: todos opcionais; se enviados, `>= 0`.
- FertilizerApplication: `rate`, `n`, `p`, `k`, `s` `>= 0` se enviados; demais opcionais.
- Harvest: `yield > 0`; `residueRemovalCount >= 0`.
- Irrigation: `quantity >= 0`, `drainage >= 0`.
- ManagementGrazing: `stockingRate > 0`.
- PlantingOperation: `seedsPerBeg >= 0`; demais opcionais.
- PrecisionAgriculture: todos opcionais.
- SoilPreparation: `depth > 0` se enviado.
- SoilSampleAnalysis: `soilSampleType` obrigatório.
