# Contrato sugerido para a API Hydro Pulse

Base URL configurada por `EXPO_PUBLIC_API_URL`. Todas as respostas devem usar JSON e timestamps ISO 8601 com fuso horário.

## Regras gerais

- Versão inicial: `/v1`.
- Erros: `{ "code": "VALIDATION_ERROR", "message": "...", "details": {} }`.
- Criação de relatos: aceitar `Idempotency-Key` com o mesmo valor de `clientId`.
- Paginação incremental: cursor opaco retornado pelo servidor.
- Dados oficiais e relatos comunitários nunca devem ser normalizados como a mesma entidade.
- Autenticação: o servidor deve armazenar a senha com hash; o app local usa um armazenamento simples apenas para o protótipo.

## Conta e autenticação

### `POST /v1/auth/register`

Cadastro com `name`, `password`, `phone`, `address` e `profilePhotoUri` opcional (ou URL após upload). A resposta retorna o usuário autenticado e um token de sessão.

### `PATCH /v1/profile`

Atualiza `name`, `phone`, `address` e `profilePhotoUri`. A foto de perfil é opcional e pode ser removida enviando o campo sem valor.

### `POST /v1/auth/login`

Login com apenas `name` e `password`. A resposta retorna o usuário autenticado e um token de sessão.

## Estações

### `GET /v1/stations`

```json
[
  {
    "id": "station-vila-mathias",
    "name": "Vila Mathias",
    "neighborhood": "Vila Mathias",
    "coordinates": { "latitude": -23.9509, "longitude": -46.3251 },
    "rainfallMm": 12.8,
    "accumulationPeriodHours": 1,
    "observedAt": "2026-09-19T14:40:00-03:00",
    "source": "CEMADEN",
    "status": "attention"
  }
]
```

`status`: `normal | attention | alert`.

## Relatos

### `GET /v1/reports?since=<timestamp>`

Retorna `FloodReport[]`. `since` é opcional.

### `POST /v1/reports`

Cabeçalho obrigatório: `Idempotency-Key: <clientId>`.

```json
{
  "clientId": "report-1726764000-a1b2c3",
  "category": "partial",
  "description": "Água cobrindo parte da pista.",
  "address": "Av. Ana Costa, Santos - SP",
  "coordinates": { "latitude": -23.9604, "longitude": -46.3354 },
  "observedAt": "2026-09-19T14:25:00-03:00",
  "authorId": "user-123",
  "photoUri": "https://cdn.example/report-photo.jpg"
}
```

Resposta `201` na primeira criação e `200` em um reenvio já processado, sempre com o mesmo registro lógico.

`category`: `passable | partial | blocked`.

### `PATCH /v1/reports/:id`

Atualiza `category`, `description`, `address`, `coordinates`, `observedAt` e `photoUri`. Apenas o `authorId` do relato pode editar seus próprios dados.

### `POST /v1/report-disputes`

Registra uma contestação com `reportId`, `authorId`, `justification` e `photoUri` opcional. O servidor deve manter a contestação para análise e moderação, sem apagar o relato automaticamente.

## Sincronização incremental

### `GET /v1/sync/pull?cursor=<cursor>`

```json
{
  "cursor": "opaque-next-cursor",
  "stations": [],
  "reports": [],
  "serverTime": "2026-09-19T14:45:00-03:00"
}
```

### `POST /v1/sync/push`

```json
{
  "deviceId": "device-local-id",
  "operations": [
    {
      "operationId": "report-1726764000-a1b2c3",
      "type": "CREATE_REPORT",
      "payload": {}
    }
  ]
}
```

```json
{
  "accepted": ["report-1726764000-a1b2c3"],
  "rejected": []
}
```

## Endpoints reservados

- `POST /v1/devices/register`: token de push e preferências do dispositivo.
- `POST /v1/reports/:id/confirmations`: confirmação comunitária.
- `GET /v1/city/summary`: resumo agregado para o cartão inicial.

Esses endpoints ainda não bloqueiam o protótipo; as interfaces visuais já possuem pontos de extensão para conectá-los.
