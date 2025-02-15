import {
  StatsigDynamicConfigs,
  StatsigExperiments,
  StatsigMultiNetworkDynamicConfig,
  StatsigParameter,
} from 'src/statsig/types'
import { NetworkId } from 'src/transactions/types'
import networkConfig from 'src/web3/networkConfig'

export const ExperimentConfigs = {
  // NOTE: the keys of defaultValues MUST be parameter names
  // Needed for CI, remove if there are actual experiments
  [StatsigExperiments.SAMPLE]: {
    experimentName: StatsigExperiments.SAMPLE,
    defaultValues: {
      testParam: 'sample-param-1',
    },
  },
} satisfies {
  [key in StatsigExperiments]: {
    experimentName: key
    defaultValues: { [key: string]: StatsigParameter }
  }
}

export const DynamicConfigs = {
  [StatsigDynamicConfigs.USERNAME_BLOCK_LIST]: {
    configName: StatsigDynamicConfigs.USERNAME_BLOCK_LIST,
    defaultValues: {
      blockedAdjectives: [] as string[],
      blockedNouns: [] as string[],
    },
  },
  [StatsigDynamicConfigs.WALLET_NETWORK_TIMEOUT_SECONDS]: {
    configName: StatsigDynamicConfigs.WALLET_NETWORK_TIMEOUT_SECONDS,
    defaultValues: {
      default: 15,
      cico: 30,
    },
  },
  [StatsigMultiNetworkDynamicConfig.MULTI_CHAIN_FEATURES]: {
    configName: StatsigMultiNetworkDynamicConfig.MULTI_CHAIN_FEATURES,
    defaultValues: {
      showCico: [networkConfig.defaultNetworkId],
      showBalances: [networkConfig.defaultNetworkId],
      showSend: [networkConfig.defaultNetworkId],
      showSwap: [networkConfig.defaultNetworkId],
      showTransfers: [networkConfig.defaultNetworkId],
      showWalletConnect: [networkConfig.defaultNetworkId],
      showApprovalTxsInHomefeed: [] as NetworkId[],
      showNfts: [networkConfig.defaultNetworkId],
      showPositions: [networkConfig.defaultNetworkId],
      showShortcuts: [networkConfig.defaultNetworkId],
    },
  },
  [StatsigDynamicConfigs.DAPP_WEBVIEW_CONFIG]: {
    configName: StatsigDynamicConfigs.DAPP_WEBVIEW_CONFIG,
    defaultValues: {
      disabledMediaPlaybackRequiresUserActionOrigins: [] as string[],
    },
  },
  [StatsigDynamicConfigs.SWAP_CONFIG]: {
    configName: StatsigDynamicConfigs.SWAP_CONFIG,
    defaultValues: {
      maxSlippagePercentage: '0.3',
      enableAppFee: false,
      popularTokenIds: [] as string[],
    },
  },
  [StatsigDynamicConfigs.CICO_TOKEN_INFO]: {
    configName: StatsigDynamicConfigs.CICO_TOKEN_INFO,
    defaultValues: {
      tokenInfo: {} as { [tokenId: string]: { cicoOrder: number } },
    },
  },
  [StatsigDynamicConfigs.WALLET_JUMPSTART_CONFIG]: {
    configName: StatsigDynamicConfigs.WALLET_JUMPSTART_CONFIG,
    defaultValues: {
      jumpstartContracts: {} as {
        [key in NetworkId]?: {
          contractAddress?: string
          depositERC20GasEstimate: string
          retiredContractAddresses?: string[]
        }
      },
      maxAllowedSendAmountUsd: 100,
    },
  },
  [StatsigDynamicConfigs.NFT_CELEBRATION_CONFIG]: {
    configName: StatsigDynamicConfigs.NFT_CELEBRATION_CONFIG,
    defaultValues: {
      celebratedNft: {} as { networkId?: NetworkId; contractAddress?: string },
      deepLink: '',
      rewardExpirationDate: new Date(0).toISOString(),
      rewardReminderDate: new Date(0).toISOString(),
    },
  },
  [StatsigDynamicConfigs.APP_CONFIG]: {
    configName: StatsigDynamicConfigs.APP_CONFIG,
    defaultValues: {
      minRequiredVersion: '0.0.0',
      links: {
        web: 'https://candle-labs.com/',
        tos: 'https://candle-labs.com/terms',
        privacy: 'https://candle-labs.com/privacy',
        faq: 'https://candle-labs.com/faq',
        funding: 'https://candle-labs.com/fund-wallet',
        forum: 'https://forum.celo.org/c/valora/8',
        swapLearnMore: 'https://valora.xyz/support/swap-learn-more',
        transactionFeesLearnMore: 'https://valora.xyz/support/transaction-fees-learn-more',
        inviteRewardsNftsLearnMore: 'https://valora.xyz/support/invite-rewards-nfts-learn-more',
        inviteRewardsStableTokenLearnMore:
          'https://valora.xyz/support/invite-rewards-stabletoken-learn-more',
        earnStablecoinsLearnMore: 'https://valora.xyz/stablecoin-earn',
      },
    },
  },
  [StatsigDynamicConfigs.EARN_CONFIG]: {
    configName: StatsigDynamicConfigs.EARN_CONFIG,
    defaultValues: {
      supportedPools: [] as string[],
      supportedAppIds: [] as string[],
    },
  },
} satisfies {
  [key in StatsigDynamicConfigs | StatsigMultiNetworkDynamicConfig]: {
    configName: key
    defaultValues: { [key: string]: StatsigParameter }
  }
}
