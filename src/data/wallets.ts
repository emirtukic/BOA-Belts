export type WalletVariant = {
  label: string;
  image: string;
  preview?: string;
};

export type WalletProduct = {
  id: string;
  name: string;
  price: string;
  category: 'slim' | 'carry';
  description: string;
  colors: WalletVariant[];
};

export const wallets: WalletProduct[] = [
  {
    "id": "w01",
    "name": "Mini novčanik",
    "price": "35 KM",
    "category": "slim",
    "description": "Idealan uz naše mini torbice. Unutar njega mogu stati sitni novci, sa kopčanjem na nitnu ili samo provlačenjem kože. Mogu stati i osnovni dokumenti i krupni novac.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Wallets/01_MINI%20NOV%C4%8CANIK_35%20KM/1.webp",
        "preview": "/Wallets/01_MINI%20NOV%C4%8CANIK_35%20KM/1.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Wallets/01_MINI%20NOV%C4%8CANIK_35%20KM/2.webp",
        "preview": "/Wallets/01_MINI%20NOV%C4%8CANIK_35%20KM/2.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Wallets/01_MINI%20NOV%C4%8CANIK_35%20KM/3.webp",
        "preview": "/Wallets/01_MINI%20NOV%C4%8CANIK_35%20KM/3.webp"
      }
    ]
  },
  {
    "id": "w34",
    "name": "Ugostiteljski novčanik",
    "price": "50 KM",
    "category": "slim",
    "description": "Model je moguće izraditi u boji po želji kao i sa gravurom po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Wallets/34_Ugostiteljski%20novcanik_50%20KM/01-ugostiteljski-wallet-front.webp",
        "preview": "/Wallets/34_Ugostiteljski%20novcanik_50%20KM/01-ugostiteljski-wallet-front.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Wallets/34_Ugostiteljski%20novcanik_50%20KM/02-ugostiteljski-wallet-detail.webp",
        "preview": "/Wallets/34_Ugostiteljski%20novcanik_50%20KM/02-ugostiteljski-wallet-detail.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Wallets/34_Ugostiteljski%20novcanik_50%20KM/03-ugostiteljski-wallet-onbody.webp",
        "preview": "/Wallets/34_Ugostiteljski%20novcanik_50%20KM/03-ugostiteljski-wallet-onbody.webp"
      }
    ]
  },
  {
    "id": "w55",
    "name": "Boa novčanik",
    "price": "45 KM",
    "category": "carry",
    "description": "Model koji ima nastavak za nošenje oko ruke, a u njega može stati čak i telefon.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Wallets/55_Boa%20novcanik_45%20KM/01-boa-wallet-front.webp",
        "preview": "/Wallets/55_Boa%20novcanik_45%20KM/01-boa-wallet-front.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Wallets/55_Boa%20novcanik_45%20KM/02-boa-wallet-detail.webp",
        "preview": "/Wallets/55_Boa%20novcanik_45%20KM/02-boa-wallet-detail.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Wallets/55_Boa%20novcanik_45%20KM/03-boa-wallet-onbody.webp",
        "preview": "/Wallets/55_Boa%20novcanik_45%20KM/03-boa-wallet-onbody.webp"
      }
    ]
  },
  {
    "id": "w64",
    "name": "Dječiji novčanik",
    "price": "30 KM",
    "category": "slim",
    "description": "Model idealan za najmlađu populaciju.\nModel je moguće izraditi u boji po želji pa čak i u obliku životinje po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Wallets/64_DJE%C4%8CIJI%20NOV%C4%8CANIK_30%20KM/189248.webp",
        "preview": "/Wallets/64_DJE%C4%8CIJI%20NOV%C4%8CANIK_30%20KM/189248.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Wallets/64_DJE%C4%8CIJI%20NOV%C4%8CANIK_30%20KM/189249.webp",
        "preview": "/Wallets/64_DJE%C4%8CIJI%20NOV%C4%8CANIK_30%20KM/189249.webp"
      }
    ]
  }
];
