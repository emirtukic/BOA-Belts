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
    "name": "Maya bag",
    "price": "180 KM",
    "category": "daily",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Bags/32_Maya%20bag_180%20KM/01-maya-bag-front.jpg",
        "preview": "/Bags/32_Maya%20bag_180%20KM/01-maya-bag-front.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Bags/32_Maya%20bag_180%20KM/02-maya-bag-detail.jpg",
        "preview": "/Bags/32_Maya%20bag_180%20KM/02-maya-bag-detail.jpg"
      },
      {
        "label": "Photo 3",
        "image": "/Bags/32_Maya%20bag_180%20KM/03-maya-bag-onbody.jpg",
        "preview": "/Bags/32_Maya%20bag_180%20KM/03-maya-bag-onbody.jpg"
      }
    ]
  },
  {
    "id": "b36",
    "name": "Mini bag",
    "price": "80 KM",
    "category": "daily",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Bags/36_Mini%20bag_80%20KM/01-mini-bag-front.jpg",
        "preview": "/Bags/36_Mini%20bag_80%20KM/01-mini-bag-front.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Bags/36_Mini%20bag_80%20KM/02-mini-bag-detail.jpg",
        "preview": "/Bags/36_Mini%20bag_80%20KM/02-mini-bag-detail.jpg"
      },
      {
        "label": "Photo 3",
        "image": "/Bags/36_Mini%20bag_80%20KM/03-mini-bag-onbody.jpg",
        "preview": "/Bags/36_Mini%20bag_80%20KM/03-mini-bag-onbody.jpg"
      }
    ]
  },
  {
    "id": "b37",
    "name": "Big bag",
    "price": "150 KM",
    "category": "travel",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Bags/37_Big%20bag_150%20KM/01-big-bag-front.jpg",
        "preview": "/Bags/37_Big%20bag_150%20KM/01-big-bag-front.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Bags/37_Big%20bag_150%20KM/02-big-bag-detail.jpg",
        "preview": "/Bags/37_Big%20bag_150%20KM/02-big-bag-detail.jpg"
      },
      {
        "label": "Photo 3",
        "image": "/Bags/37_Big%20bag_150%20KM/03-big-bag-onbody.jpg",
        "preview": "/Bags/37_Big%20bag_150%20KM/03-big-bag-onbody.jpg"
      }
    ]
  },
  {
    "id": "b59",
    "name": "Cube bag",
    "price": "80 KM",
    "category": "daily",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Bags/59_Cube%20bag_80%20KM/01-cube-bag-front.jpg",
        "preview": "/Bags/59_Cube%20bag_80%20KM/01-cube-bag-front.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Bags/59_Cube%20bag_80%20KM/02-cube-bag-detail.jpg",
        "preview": "/Bags/59_Cube%20bag_80%20KM/02-cube-bag-detail.jpg"
      },
      {
        "label": "Photo 3",
        "image": "/Bags/59_Cube%20bag_80%20KM/03-cube-bag-onbody.jpg",
        "preview": "/Bags/59_Cube%20bag_80%20KM/03-cube-bag-onbody.jpg"
      }
    ]
  },
  {
    "id": "b61",
    "name": "Mens bag",
    "price": "60 KM",
    "category": "daily",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Bags/61_Mens%20bag_60%20KM/01-mens-bag-front.jpg",
        "preview": "/Bags/61_Mens%20bag_60%20KM/01-mens-bag-front.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Bags/61_Mens%20bag_60%20KM/02-mens-bag-detail.jpg",
        "preview": "/Bags/61_Mens%20bag_60%20KM/02-mens-bag-detail.jpg"
      },
      {
        "label": "Photo 3",
        "image": "/Bags/61_Mens%20bag_60%20KM/03-mens-bag-onbody.jpg",
        "preview": "/Bags/61_Mens%20bag_60%20KM/03-mens-bag-onbody.jpg"
      }
    ]
  },
  {
    "id": "b62",
    "name": "Boa bag",
    "price": "100 KM",
    "category": "travel",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Bags/62_Boa%20bag_100%20KM/01-boa-bag-front.jpg",
        "preview": "/Bags/62_Boa%20bag_100%20KM/01-boa-bag-front.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Bags/62_Boa%20bag_100%20KM/02-boa-bag-detail.jpg",
        "preview": "/Bags/62_Boa%20bag_100%20KM/02-boa-bag-detail.jpg"
      },
      {
        "label": "Photo 3",
        "image": "/Bags/62_Boa%20bag_100%20KM/03-boa-bag-onbody.jpg",
        "preview": "/Bags/62_Boa%20bag_100%20KM/03-boa-bag-onbody.jpg"
      }
    ]
  },
  {
    "id": "b63",
    "name": "Business bag",
    "price": "120 KM",
    "category": "travel",
    "description": "Ručna izrada u Travniku, prilagodljiva silueta i završna obrada spremna za vaš stil.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Bags/63_Business%20bag_120%20KM/01-business-bag-front.jpg",
        "preview": "/Bags/63_Business%20bag_120%20KM/01-business-bag-front.jpg"
      },
      {
        "label": "Photo 2",
        "image": "/Bags/63_Business%20bag_120%20KM/02-business-bag-detail.jpg",
        "preview": "/Bags/63_Business%20bag_120%20KM/02-business-bag-detail.jpg"
      }
    ]
  }
];
