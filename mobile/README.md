# Hydro Pulse Mobile

Front-end mobile em React Native + Expo para Android e iOS. O protótipo apresenta dados oficiais de precipitação e relatos colaborativos de alagamentos em camadas visualmente distintas, com fila offline persistente.

## Rodar o projeto

Requisitos: Node.js LTS e um dispositivo com Expo Go, Android Studio ou Xcode.

```bash
pnpm install
cp .env.example .env
pnpm start
```

Atalhos:

```bash
pnpm android
pnpm ios
pnpm web
pnpm typecheck
pnpm validate
```

No Windows, a build de iOS deve ser feita pelo EAS Build ou em um Mac com Xcode.

## Integração com o back-end

Por padrão, o app usa dados simulados. Para apontar para a API:

```env
EXPO_PUBLIC_API_URL=https://api.seu-dominio.com
EXPO_PUBLIC_USE_MOCKS=false
```

Os serviços estão centralizados em `src/services/api`. O contrato sugerido está em `docs/backend-contract.md` e os modelos compartilhados em `src/types/domain.ts`.

## Estrutura

- `src/screens`: telas e fluxos do aplicativo.
- `src/components`: componentes visuais reutilizáveis.
- `src/services/api`: cliente HTTP e endpoints isolados.
- `src/store`: estado global, persistência e fila offline.
- `src/types`: contratos TypeScript para integração.
- `src/data`: fixtures utilizadas enquanto a API não está disponível.

## Comportamento offline

Ao registrar uma ocorrência sem conexão, o app cria um `clientId` único, grava a operação no AsyncStorage e a exibe como pendente. A mesma chave é enviada no cabeçalho `Idempotency-Key` em todas as tentativas, permitindo que o servidor reconheça reenvios sem duplicar registros.

A conectividade é acompanhada pelo `expo-network`. A fila tenta sincronizar quando a rede volta e quando o aplicativo retorna ao primeiro plano. O interruptor da tela **Atividade** permite simular uma falha de conexão durante a demonstração do front-end sem desligar a rede do aparelho.
