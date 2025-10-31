export type WalletVariant = {
  label: string;
  image: string;
  preview?: string;
  swatch?: string;
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
    "name": "Mini Novčanik",
    "price": "35 KM",
    "category": "slim",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Wallets/01_MINI%20NOV%C4%8CANIK_35%20KM/1.jpg",
        "preview": "/Wallets/01_MINI%20NOV%C4%8CANIK_35%20KM/1.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Wallets/01_MINI%20NOV%C4%8CANIK_35%20KM/2.jpg",
        "preview": "/Wallets/01_MINI%20NOV%C4%8CANIK_35%20KM/2.jpg"
      },
      {
        "label": "Photo 3",
        "image": "/Wallets/01_MINI%20NOV%C4%8CANIK_35%20KM/3.jpg",
        "preview": "/Wallets/01_MINI%20NOV%C4%8CANIK_35%20KM/3.jpg"
      }
    ]
  },
  {
    "id": "w34",
    "name": "Muški Novčanik Za Konobare",
    "price": "50 KM",
    "category": "slim",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Wallets/34_MU%C5%A0KI%20NOV%C4%8CANIK%20ZA%20KONOBARE_50%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.28_08e0197e.jpg",
        "preview": "/Wallets/34_MU%C5%A0KI%20NOV%C4%8CANIK%20ZA%20KONOBARE_50%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.28_08e0197e.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Wallets/34_MU%C5%A0KI%20NOV%C4%8CANIK%20ZA%20KONOBARE_50%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.28_70b54da6.jpg",
        "preview": "/Wallets/34_MU%C5%A0KI%20NOV%C4%8CANIK%20ZA%20KONOBARE_50%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.28_70b54da6.jpg"
      },
      {
        "label": "Photo 3",
        "image": "/Wallets/34_MU%C5%A0KI%20NOV%C4%8CANIK%20ZA%20KONOBARE_50%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.28_f7c612c4.jpg",
        "preview": "/Wallets/34_MU%C5%A0KI%20NOV%C4%8CANIK%20ZA%20KONOBARE_50%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.28_f7c612c4.jpg"
      }
    ]
  },
  {
    "id": "w55",
    "name": "Novčanici Veliki",
    "price": "45 KM",
    "category": "carry",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Wallets/55_NOV%C4%8CANICI%20VELIKI%20_45%20KM/1.jpg",
        "preview": "/Wallets/55_NOV%C4%8CANICI%20VELIKI%20_45%20KM/1.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Wallets/55_NOV%C4%8CANICI%20VELIKI%20_45%20KM/147066.jpg",
        "preview": "/Wallets/55_NOV%C4%8CANICI%20VELIKI%20_45%20KM/147066.jpg"
      },
      {
        "label": "Photo 3",
        "image": "/Wallets/55_NOV%C4%8CANICI%20VELIKI%20_45%20KM/210221.jpg",
        "preview": "/Wallets/55_NOV%C4%8CANICI%20VELIKI%20_45%20KM/210221.jpg"
      }
    ]
  },
  {
    "id": "w64",
    "name": "Dječiji Novčanik",
    "price": "30 KM",
    "category": "slim",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Wallets/64_DJE%C4%8CIJI%20NOV%C4%8CANIK_30%20KM/189248.jpg",
        "preview": "/Wallets/64_DJE%C4%8CIJI%20NOV%C4%8CANIK_30%20KM/189248.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Wallets/64_DJE%C4%8CIJI%20NOV%C4%8CANIK_30%20KM/189249.jpg",
        "preview": "/Wallets/64_DJE%C4%8CIJI%20NOV%C4%8CANIK_30%20KM/189249.jpg"
      }
    ]
  }
];
