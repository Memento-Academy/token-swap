# Hardhat Configuration - Token Swap dApp

## Setup Completo ✅

Hardhat está configurado y listo para usar con Sepolia testnet.

## Estructura de Carpetas

```
token-swap/
├── contracts/          # Contratos Solidity
├── scripts/           # Scripts de deployment
├── test/              # Tests de contratos
├── hardhat.config.ts  # Configuración de Hardhat
└── .env.local         # Variables de entorno
```

## Variables de Entorno Requeridas

Agrega estas variables a tu `.env.local`:

```bash
# Sepolia RPC URL
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://rpc.sepolia.org

# Private key para deployment (¡NUNCA la subas a Git!)
DEPLOYER_PRIVATE_KEY=tu_private_key_aqui
```

## Scripts Disponibles

```bash
# Compilar contratos
npm run compile

# Ejecutar tests
npm run test:contracts

# Deploy a Sepolia
npm run deploy:sepolia

# Deploy local (Hardhat Network)
npm run deploy:local
```

## Próximos Pasos

1. ✅ Hardhat configurado
2. ⏳ Crear contratos mock (PEPE, USDC)
3. ⏳ Crear router de swap
4. ⏳ Crear script de deployment
5. ⏳ Crear tests de integración

## Configuración de Red

- **Sepolia Testnet**: Chain ID 11155111
- **Solidity Version**: 0.8.20
- **Optimizer**: Habilitado (200 runs)
- **TypeChain**: Configurado para ethers-v6
