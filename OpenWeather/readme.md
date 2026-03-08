**Considerações Importantes**

API Key: No Spring Boot, adicione a chave no application.properties:
openweather.api.key=CHAVE_AQUI

Custo e Limites: A API One Call 3.0 é do tipo "pay-as-you-go", mas oferece 1.000 chamadas diárias gratuitas. Como o cálculo de uma safra de 120 dias consome 120 chamadas (uma por dia), pode-se processar cerca de 8 solicitações de safra completas por dia no plano gratuito.
Ou, se for feita uma chamada por dia para as coordenadas de uma fazenda de maneira "antecipada", pode-se estar processando os dados de 1000 fazendas diariamente no sistema.

Otimização: Recomendável salvar os resultados diários em um banco de dados local para evitar chamadas repetidas à API para as mesmas coordenadas e datas.

CORS: No controller, usei @CrossOrigin(origins = "*") para facilitar o desenvolvimento.

Exatidão: A média é calculada dividindo o total acumulado pelo número de dias do período. Para agricultura, o Total Acumulado costuma ser o dado mais crítico para entender o desenvolvimento da planta.
