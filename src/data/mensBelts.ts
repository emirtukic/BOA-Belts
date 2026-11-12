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
    "name": "Classic belt",
    "price": "35 KM",
    "category": "men",
    "description": "Model muškog kaiša dostupan u četiri boje: crna, smeđa, konjak i tamnoplava.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Mens%20Belts/02_Classic%20belt_35%20KM/01-classic-belt-front.webp",
        "preview": "/Mens%20Belts/02_Classic%20belt_35%20KM/01-classic-belt-front.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Mens%20Belts/02_Classic%20belt_35%20KM/02-classic-belt-detail.webp",
        "preview": "/Mens%20Belts/02_Classic%20belt_35%20KM/02-classic-belt-detail.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Mens%20Belts/02_Classic%20belt_35%20KM/03-classic-belt-onbody.webp",
        "preview": "/Mens%20Belts/02_Classic%20belt_35%20KM/03-classic-belt-onbody.webp"
      }
    ]
  },
  {
    "id": "m35",
    "name": "Hunter belt",
    "price": "250 KM",
    "category": "men",
    "description": "Model namijenjen isključivo lovcima napravljen tako da odgovara zadatku funkcionalnosti i ljepote u jednom.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Mens%20Belts/35_Hunter%20belt_250%20KM/01-hunter-belt-front.webp",
        "preview": "/Mens%20Belts/35_Hunter%20belt_250%20KM/01-hunter-belt-front.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Mens%20Belts/35_Hunter%20belt_250%20KM/02-hunter-belt-detail.webp",
        "preview": "/Mens%20Belts/35_Hunter%20belt_250%20KM/02-hunter-belt-detail.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Mens%20Belts/35_Hunter%20belt_250%20KM/03-hunter-belt-onbody.webp",
        "preview": "/Mens%20Belts/35_Hunter%20belt_250%20KM/03-hunter-belt-onbody.webp"
      }
    ]
  }
];

