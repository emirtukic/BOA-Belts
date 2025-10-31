export type BagVariant = {
  label: string;
  image: string;
  preview?: string;
};

export type BagProduct = {
  id: string;
  name: string;
  price: string;
  category: 'daily' | 'travel';
  description: string;
  colors: BagVariant[];
};

export const bags: BagProduct[] = [
  {
    "id": "b32",
    "name": "Maya Torba",
    "price": "180 KM",
    "category": "daily",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Bags/32_MAYA%20TORBA_180%20KM/1.jpg",
        "preview": "/Bags/32_MAYA%20TORBA_180%20KM/1.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Bags/32_MAYA%20TORBA_180%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.31_96aa13a0.jpg",
        "preview": "/Bags/32_MAYA%20TORBA_180%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.31_96aa13a0.jpg"
      },
      {
        "label": "Photo 3",
        "image": "/Bags/32_MAYA%20TORBA_180%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.31_ae5942ad.jpg",
        "preview": "/Bags/32_MAYA%20TORBA_180%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.31_ae5942ad.jpg"
      }
    ]
  },
  {
    "id": "b36",
    "name": "Torbica Mala",
    "price": "80 KM",
    "category": "daily",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Bags/36_TORBICA%20MALA_80%20KM/WhatsApp%20Image%202025-10-26%20at%2017.24.40_ce6973cc.jpg",
        "preview": "/Bags/36_TORBICA%20MALA_80%20KM/WhatsApp%20Image%202025-10-26%20at%2017.24.40_ce6973cc.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Bags/36_TORBICA%20MALA_80%20KM/WhatsApp%20Image%202025-10-26%20at%2017.24.40_e0f807c4.jpg",
        "preview": "/Bags/36_TORBICA%20MALA_80%20KM/WhatsApp%20Image%202025-10-26%20at%2017.24.40_e0f807c4.jpg"
      },
      {
        "label": "Photo 3",
        "image": "/Bags/36_TORBICA%20MALA_80%20KM/WhatsApp%20Image%202025-10-26%20at%2017.24.41_a35a86d6.jpg",
        "preview": "/Bags/36_TORBICA%20MALA_80%20KM/WhatsApp%20Image%202025-10-26%20at%2017.24.41_a35a86d6.jpg"
      }
    ]
  },
  {
    "id": "b37",
    "name": "Torba Velika",
    "price": "150 KM",
    "category": "travel",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Bags/37_TORBA%20VELIKA_150%20KM/01.jpg",
        "preview": "/Bags/37_TORBA%20VELIKA_150%20KM/01.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Bags/37_TORBA%20VELIKA_150%20KM/02.jpg",
        "preview": "/Bags/37_TORBA%20VELIKA_150%20KM/02.jpg"
      },
      {
        "label": "Photo 3",
        "image": "/Bags/37_TORBA%20VELIKA_150%20KM/06.jpg",
        "preview": "/Bags/37_TORBA%20VELIKA_150%20KM/06.jpg"
      }
    ]
  },
  {
    "id": "b59",
    "name": "Torba",
    "price": "80 KM",
    "category": "daily",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Bags/59_TORBA_80%20KM/WhatsApp%20Image%202025-10-26%20at%2017.24.41_aabf3bd5.jpg",
        "preview": "/Bags/59_TORBA_80%20KM/WhatsApp%20Image%202025-10-26%20at%2017.24.41_aabf3bd5.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Bags/59_TORBA_80%20KM/WhatsApp%20Image%202025-10-26%20at%2017.24.41_b81a0633.jpg",
        "preview": "/Bags/59_TORBA_80%20KM/WhatsApp%20Image%202025-10-26%20at%2017.24.41_b81a0633.jpg"
      },
      {
        "label": "Photo 3",
        "image": "/Bags/59_TORBA_80%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.32_3b10df60.jpg",
        "preview": "/Bags/59_TORBA_80%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.32_3b10df60.jpg"
      }
    ]
  },
  {
    "id": "b61",
    "name": "Torbica Za Muškarce Za Telefon",
    "price": "60 KM",
    "category": "daily",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Bags/61_TORBICA%20ZA%20MU%C5%A0KARCE%20ZA%20TELEFON%20_%2060%20KM/WhatsApp%20Image%202025-10-26%20at%2017.18.35_24015b1f.jpg",
        "preview": "/Bags/61_TORBICA%20ZA%20MU%C5%A0KARCE%20ZA%20TELEFON%20_%2060%20KM/WhatsApp%20Image%202025-10-26%20at%2017.18.35_24015b1f.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Bags/61_TORBICA%20ZA%20MU%C5%A0KARCE%20ZA%20TELEFON%20_%2060%20KM/WhatsApp%20Image%202025-10-26%20at%2017.18.36_f2a015bb.jpg",
        "preview": "/Bags/61_TORBICA%20ZA%20MU%C5%A0KARCE%20ZA%20TELEFON%20_%2060%20KM/WhatsApp%20Image%202025-10-26%20at%2017.18.36_f2a015bb.jpg"
      },
      {
        "label": "Photo 3",
        "image": "/Bags/61_TORBICA%20ZA%20MU%C5%A0KARCE%20ZA%20TELEFON%20_%2060%20KM/WhatsApp%20Image%202025-10-26%20at%2017.24.37_de297ad5.jpg",
        "preview": "/Bags/61_TORBICA%20ZA%20MU%C5%A0KARCE%20ZA%20TELEFON%20_%2060%20KM/WhatsApp%20Image%202025-10-26%20at%2017.24.37_de297ad5.jpg"
      }
    ]
  },
  {
    "id": "b62",
    "name": "Torba Srednja",
    "price": "100 KM",
    "category": "travel",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Bags/62_TORBA%20SREDNJA%20_100%20KM/WhatsApp%20Image%202025-10-26%20at%2017.18.27_17cc8dc3.jpg",
        "preview": "/Bags/62_TORBA%20SREDNJA%20_100%20KM/WhatsApp%20Image%202025-10-26%20at%2017.18.27_17cc8dc3.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Bags/62_TORBA%20SREDNJA%20_100%20KM/WhatsApp%20Image%202025-10-26%20at%2017.18.28_11f510a5.jpg",
        "preview": "/Bags/62_TORBA%20SREDNJA%20_100%20KM/WhatsApp%20Image%202025-10-26%20at%2017.18.28_11f510a5.jpg"
      },
      {
        "label": "Photo 3",
        "image": "/Bags/62_TORBA%20SREDNJA%20_100%20KM/WhatsApp%20Image%202025-10-26%20at%2017.18.33_c9734df0.jpg",
        "preview": "/Bags/62_TORBA%20SREDNJA%20_100%20KM/WhatsApp%20Image%202025-10-26%20at%2017.18.33_c9734df0.jpg"
      }
    ]
  },
  {
    "id": "b63",
    "name": "Muška Velika Torba",
    "price": "120 KM",
    "category": "travel",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Bags/63_MU%C5%A0KA%20VELIKA%20TORBA%20_120%20KM/1.jpg",
        "preview": "/Bags/63_MU%C5%A0KA%20VELIKA%20TORBA%20_120%20KM/1.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Bags/63_MU%C5%A0KA%20VELIKA%20TORBA%20_120%20KM/WhatsApp%20Image%202025-10-26%20at%2017.18.18_a10c78de.jpg",
        "preview": "/Bags/63_MU%C5%A0KA%20VELIKA%20TORBA%20_120%20KM/WhatsApp%20Image%202025-10-26%20at%2017.18.18_a10c78de.jpg"
      }
    ]
  }
];
