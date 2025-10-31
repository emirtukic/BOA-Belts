export type MensBeltVariant = {
  label: string;
  image: string;
  preview?: string;
  swatch?: string;
};

export type MensBelt = {
  id: string;
  name: string;
  price: string;
  category: 'men';
  description: string;
  colors: MensBeltVariant[];
};

export const mensBelts: MensBelt[] = [
  {
    "id": "m02",
    "name": "Muški Kaiš",
    "price": "35 KM",
    "category": "men",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Mens%20Belts/02_MU%C5%A0KI%20KAI%C5%A0%20_35KM/112.jpg",
        "preview": "/Mens%20Belts/02_MU%C5%A0KI%20KAI%C5%A0%20_35KM/112.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Mens%20Belts/02_MU%C5%A0KI%20KAI%C5%A0%20_35KM/189276.jpg",
        "preview": "/Mens%20Belts/02_MU%C5%A0KI%20KAI%C5%A0%20_35KM/189276.jpg"
      },
      {
        "label": "Photo 3",
        "image": "/Mens%20Belts/02_MU%C5%A0KI%20KAI%C5%A0%20_35KM/WhatsApp%20Image%202025-10-26%20at%2017.42.35_6fd66cfd.jpg",
        "preview": "/Mens%20Belts/02_MU%C5%A0KI%20KAI%C5%A0%20_35KM/WhatsApp%20Image%202025-10-26%20at%2017.42.35_6fd66cfd.jpg"
      }
    ]
  },
  {
    "id": "m35",
    "name": "Muški Lovački Kaiš",
    "price": "250 KM",
    "category": "men",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Mens%20Belts/35_MU%C5%A0KI%20LOVA%C4%8CKI%20KAI%C5%A0_250%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.29_f1813ace.jpg",
        "preview": "/Mens%20Belts/35_MU%C5%A0KI%20LOVA%C4%8CKI%20KAI%C5%A0_250%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.29_f1813ace.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Mens%20Belts/35_MU%C5%A0KI%20LOVA%C4%8CKI%20KAI%C5%A0_250%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.30_81a9f134.jpg",
        "preview": "/Mens%20Belts/35_MU%C5%A0KI%20LOVA%C4%8CKI%20KAI%C5%A0_250%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.30_81a9f134.jpg"
      },
      {
        "label": "Photo 3",
        "image": "/Mens%20Belts/35_MU%C5%A0KI%20LOVA%C4%8CKI%20KAI%C5%A0_250%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.30_e84bdbe5.jpg",
        "preview": "/Mens%20Belts/35_MU%C5%A0KI%20LOVA%C4%8CKI%20KAI%C5%A0_250%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.30_e84bdbe5.jpg"
      }
    ]
  }
];
