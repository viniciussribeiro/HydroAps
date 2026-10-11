# Hydro Pulse

O Hydro Pulse é um protótipo de aplicativo móvel que aproxima medições de chuva de relatos locais de alagamento. A proposta é ajudar moradores a consultar as condições apresentadas na cidade e compartilhar o que encontram nas ruas.

O aplicativo distingue duas fontes de informação: medições de estações pluviométricas e observações enviadas pela comunidade. Juntas, elas podem oferecer uma visão mais completa da situação local; cada uma, porém, tem sua própria origem e precisa ser interpretada de acordo com ela.

## O que o front-end apresenta

- **Início:** resumo de chuva, estações e relatos recentes, com acesso rápido ao mapa e ao formulário de relato.
- **Mapa:** representação visual de Santos com pontos de estações e relatos. Tocar em um ponto abre seus detalhes.
- **Relatos:** registro de ocorrência como leve, moderada ou grave, com local, horário e descrição. A localização pode ser obtida no aparelho, se a pessoa autorizar, ou informada manualmente.
- **Detalhes e colaboração:** confirmação de um relato, contestação com justificativa e foto de evidência, e edição do relato feito pela própria conta.
- **Atividade:** acompanhamento dos relatos pendentes e sincronizados. A tela também permite simular a perda de conexão e tentar sincronizar a fila manualmente.
- **Conta e perfil:** cadastro e login locais, edição das informações e foto de perfil opcional.

## Estado atual do protótipo

O projeto contém o front-end, sem um back-end implantado. O app inicia com dados simulados de Santos, incluindo medições atribuídas às estações de exemplo. Esses dados não são monitoramento em tempo real.

O mapa é ilustrativo, sem cartografia geográfica real. Os controles de busca, filtros e centralização aparecem na interface, mas ainda não estão conectados a essas funções. O botão de foto no formulário de novo relato também aguarda integração; a foto de evidência em uma contestação e a foto de perfil podem ser escolhidas na galeria. As notificações são demonstrativas.

Contas, sessão e relatos ficam no armazenamento local do aparelho. A autenticação é apenas para demonstração e não protege senhas como um serviço de produção. Use dados de teste. Relatos comunitários não são verificados por uma autoridade, e o aplicativo não substitui orientações da Defesa Civil nem canais de emergência.

## Executar o aplicativo

Requisitos: Node.js LTS, pnpm e Expo Go ou Android Studio. Para executar ou compilar no iOS, é necessário um Mac com Xcode ou o EAS Build.

```powershell
cd mobile
pnpm install
Copy-Item .env.example .env
pnpm start
```

No macOS ou Linux, use `cp .env.example .env` no lugar de `Copy-Item`.

Com o Expo iniciado, abra o app no Expo Go ou use os comandos:

```bash
pnpm android
pnpm ios
pnpm web
pnpm typecheck
pnpm validate
```

## Conectar a uma API

Por padrão, o front-end usa dados simulados. Para apontá-lo a uma API compatível, configure o arquivo `mobile/.env`:

```env
EXPO_PUBLIC_API_URL=https://api.seu-dominio.com
EXPO_PUBLIC_USE_MOCKS=false
```

O formato esperado para autenticação, estações, relatos e sincronização está no [contrato sugerido da API](mobile/docs/backend-contract.md). A [documentação do código](mobile/docs/codigo.md) descreve a navegação, o estado local e os fluxos do protótipo.

## Tecnologias

React Native, Expo, TypeScript, React Navigation, Zustand e AsyncStorage.

## Estrutura

- `mobile/src/screens`: telas e fluxos do aplicativo.
- `mobile/src/components`: componentes reutilizáveis, incluindo o mapa ilustrativo.
- `mobile/src/data`: dados de demonstração.
- `mobile/src/store`: estado, persistência local e fila de sincronização.
- `mobile/src/services/api`: cliente HTTP e integração preparada para uma API.
- `mobile/docs`: contrato da API e documentação técnica.
