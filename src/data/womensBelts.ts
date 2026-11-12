export type WomensBeltVariant = {
  label: string;
  image: string;
  preview?: string;
};

export type WomensBelt = {
  id: string;
  name: string;
  price: string;
  category: 'women';
  description: string;
  badge?: string;
  priority?: number;
  colors: WomensBeltVariant[];
};

export const womensBelts: WomensBelt[] = [
  {
    "id": "w68",
    "name": "Nora belt",
    "price": "70 KM",
    "category": "women",
    "description": "Nora belt spaja mekane nabrane plohe i čistu liniju koja naglašava struk bez osjećaja težine. Model izrađujemo ručno od kvalitetne kože i moguće ga je naručiti u boji po želji.",
    "badge": "Novo",
    "priority": 2,
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/Nora%20belt%2070%20KM/8J3A0636.webp",
        "preview": "/Womens%20Belts/Nora%20belt%2070%20KM/8J3A0636.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/Nora%20belt%2070%20KM/8J3A0637.webp",
        "preview": "/Womens%20Belts/Nora%20belt%2070%20KM/8J3A0637.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/Nora%20belt%2070%20KM/8J3A0638.webp",
        "preview": "/Womens%20Belts/Nora%20belt%2070%20KM/8J3A0638.webp"
      }
    ]
  },
  {
    "id": "w67",
    "name": "Ruby belt",
    "price": "100 KM",
    "category": "women",
    "description": "Ruby belt je statement model koji kombinira strukturu korzeta i mekane remenice kako bi naglasio struk. Model je moguce izraditi u boji po zelji.",
    "badge": "Novo",
    "priority": 1,
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/RUBY%20BELT%20100%20KM/58ff3d91-60bd-4066-96a5-392d1fd9ac70.webp",
        "preview": "/Womens%20Belts/RUBY%20BELT%20100%20KM/58ff3d91-60bd-4066-96a5-392d1fd9ac70.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/RUBY%20BELT%20100%20KM/75ebe430-c3ed-4e78-a777-e6ade36059e7.webp",
        "preview": "/Womens%20Belts/RUBY%20BELT%20100%20KM/75ebe430-c3ed-4e78-a777-e6ade36059e7.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/RUBY%20BELT%20100%20KM/a4d22a04-e8f8-4214-a005-54bae9ccb82a.webp",
        "preview": "/Womens%20Belts/RUBY%20BELT%20100%20KM/a4d22a04-e8f8-4214-a005-54bae9ccb82a.webp"
      }
    ]
  },
  {
    "id": "w03",
    "name": "Angel belt",
    "price": "150 KM",
    "category": "women",
    "description": "Model koji je sličan Zana belt-u ali ovaj put u malo elegantnijoj formi gdje umjesto perja, svoju formu dobija naborima kože. Model je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/03_ANGEL%20BELT_150%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.46_5d6f888a.webp",
        "preview": "/Womens%20Belts/03_ANGEL%20BELT_150%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.46_5d6f888a.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/03_ANGEL%20BELT_150%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.46_535b4d61.webp",
        "preview": "/Womens%20Belts/03_ANGEL%20BELT_150%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.46_535b4d61.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/03_ANGEL%20BELT_150%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.46_02801c73.webp",
        "preview": "/Womens%20Belts/03_ANGEL%20BELT_150%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.46_02801c73.webp"
      }
    ]
  },
  {
    "id": "w04",
    "name": "Eva belt",
    "price": "85 KM",
    "category": "women",
    "description": "Model za one koje ne vole da imaju torbe kraj sebe ali zato uz kaiš dobiju i prostor za odložiti novac, ključeve i telefon. Model je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/04_EVA%20BELT_%2085%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.45_332896f5.webp",
        "preview": "/Womens%20Belts/04_EVA%20BELT_%2085%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.45_332896f5.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/04_EVA%20BELT_%2085%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.45_bd4cef2e.webp",
        "preview": "/Womens%20Belts/04_EVA%20BELT_%2085%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.45_bd4cef2e.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/04_EVA%20BELT_%2085%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.45_dfdbbecb.webp",
        "preview": "/Womens%20Belts/04_EVA%20BELT_%2085%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.45_dfdbbecb.webp"
      }
    ]
  },
  {
    "id": "w05",
    "name": "No.6 belt",
    "price": "40 KM",
    "category": "women",
    "description": "Basic kaiš sa preslatkom mašnicom u fronti. Moguće ga je nositi i na kukovima i na struku.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/05_No.6%20belt_40%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.44_ba571411.webp",
        "preview": "/Womens%20Belts/05_No.6%20belt_40%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.44_ba571411.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/05_No.6%20belt_40%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.44_c7b95368.webp",
        "preview": "/Womens%20Belts/05_No.6%20belt_40%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.44_c7b95368.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/05_No.6%20belt_40%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.44_eeb2c374.webp",
        "preview": "/Womens%20Belts/05_No.6%20belt_40%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.44_eeb2c374.webp"
      }
    ]
  },
  {
    "id": "w06",
    "name": "Furious belt",
    "price": "100 KM",
    "category": "women",
    "description": "Model koji je prilagođen osobama koje vole da se sve njihove starčice nalaze direktno uz njih. Na obični kaiš, nižu se torbica po torbica i detalj po detalj. Model je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/06_FURIOUS%20BELT%20_100%20KM/189273.webp",
        "preview": "/Womens%20Belts/06_FURIOUS%20BELT%20_100%20KM/189273.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/06_FURIOUS%20BELT%20_100%20KM/189279.webp",
        "preview": "/Womens%20Belts/06_FURIOUS%20BELT%20_100%20KM/189279.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/06_FURIOUS%20BELT%20_100%20KM/viber_image_2020-11-06_18-19-23.webp",
        "preview": "/Womens%20Belts/06_FURIOUS%20BELT%20_100%20KM/viber_image_2020-11-06_18-19-23.webp"
      }
    ]
  },
  {
    "id": "w07",
    "name": "No.1 belt",
    "price": "85 KM",
    "category": "women",
    "description": "Naš prvenac! Prvi kaiš ikada! Široki kaiš na vezanje idealan za sve prigode. Model je moguće izraditi u boji po želji",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/07_No.1_85%20KM/189253.webp",
        "preview": "/Womens%20Belts/07_No.1_85%20KM/189253.webp"
      }
    ]
  },
  {
    "id": "w08",
    "name": "No.3 belt",
    "price": "70 KM",
    "category": "women",
    "description": "Jednostavnost, elegancija, čistoća i fleksibilnost idealni su opisi za ovaj široki kaiš koji se veže naprijed ili, ukoliko tako odlučite, nazad.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/08_No.3_70%20KM/189254.webp",
        "preview": "/Womens%20Belts/08_No.3_70%20KM/189254.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/08_No.3_70%20KM/189277.webp",
        "preview": "/Womens%20Belts/08_No.3_70%20KM/189277.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/08_No.3_70%20KM/189278.webp",
        "preview": "/Womens%20Belts/08_No.3_70%20KM/189278.webp"
      }
    ]
  },
  {
    "id": "w09",
    "name": "No.4 belt",
    "price": "70 KM",
    "category": "women",
    "description": "Model koji, za razliku od modela No.3, naprijed ima tanke kaiševe za vezanje.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/09_No.4_70%20KM/66686.webp",
        "preview": "/Womens%20Belts/09_No.4_70%20KM/66686.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/09_No.4_70%20KM/66687.webp",
        "preview": "/Womens%20Belts/09_No.4_70%20KM/66687.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/09_No.4_70%20KM/189283.webp",
        "preview": "/Womens%20Belts/09_No.4_70%20KM/189283.webp"
      }
    ]
  },
  {
    "id": "w10",
    "name": "No.5 belt",
    "price": "60 KM",
    "category": "women",
    "description": "Model koji se pretežno nosi na kukovima, u dvije boje ili samo u jednoj boji. Idealan za jednostavne odjevne kombinacije.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/10_No.5_60%20KM/189271.webp",
        "preview": "/Womens%20Belts/10_No.5_60%20KM/189271.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/10_No.5_60%20KM/189272.webp",
        "preview": "/Womens%20Belts/10_No.5_60%20KM/189272.webp"
      }
    ]
  },
  {
    "id": "w11",
    "name": "Basic belt",
    "price": "35 KM",
    "category": "women",
    "description": "Jednostavan kaiš kod kojeg birate njegovu širinu kao i boju. Od širine kaiša zavisi i širina kopče.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/11_Basic%20belt_35%20KM/01-basic-belt-onbody.webp",
        "preview": "/Womens%20Belts/11_Basic%20belt_35%20KM/01-basic-belt-onbody.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/11_Basic%20belt_35%20KM/02-basic-belt-detail.webp",
        "preview": "/Womens%20Belts/11_Basic%20belt_35%20KM/02-basic-belt-detail.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/11_Basic%20belt_35%20KM/03-basic-belt-front.webp",
        "preview": "/Womens%20Belts/11_Basic%20belt_35%20KM/03-basic-belt-front.webp"
      }
    ]
  },
  {
    "id": "w12",
    "name": "Bold belt",
    "price": "55 KM",
    "category": "women",
    "description": "Jednostavan kaiš kod kojeg se tregeri mogu skinuti i na taj način postaje klasični kaiš.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/12_BOLD%20BELT_55%20KM/189267.webp",
        "preview": "/Womens%20Belts/12_BOLD%20BELT_55%20KM/189267.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/12_BOLD%20BELT_55%20KM/189268.webp",
        "preview": "/Womens%20Belts/12_BOLD%20BELT_55%20KM/189268.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/12_BOLD%20BELT_55%20KM/viber_image_2020-11-18_17-06-36.webp",
        "preview": "/Womens%20Belts/12_BOLD%20BELT_55%20KM/viber_image_2020-11-18_17-06-36.webp"
      }
    ]
  },
  {
    "id": "w13",
    "name": "No.2 belt",
    "price": "80 KM",
    "category": "women",
    "description": "Ponovno jedan od zahtjevnijih, prvih kaiševa. Rađen je iz jednog komada, gdje se iz jednog dijela širi prema drugom i sve se završava sa dvije šnale.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/13_No.2_80%20KM/189266.webp",
        "preview": "/Womens%20Belts/13_No.2_80%20KM/189266.webp"
      }
    ]
  },
  {
    "id": "w14",
    "name": "Teja belt",
    "price": "80 KM",
    "category": "women",
    "description": "Jedan od najprodavanijih modela ikada! Birate širinu kaišića, boju i boju detalja. Ovaj model, mimo toga što ističe struk ispreplićući više malih kaiševa, naglašava i ramena.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/14_TEJA%20BELT%20_80%20KM/189150.webp",
        "preview": "/Womens%20Belts/14_TEJA%20BELT%20_80%20KM/189150.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/14_TEJA%20BELT%20_80%20KM/189263.webp",
        "preview": "/Womens%20Belts/14_TEJA%20BELT%20_80%20KM/189263.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/14_TEJA%20BELT%20_80%20KM/189264.webp",
        "preview": "/Womens%20Belts/14_TEJA%20BELT%20_80%20KM/189264.webp"
      }
    ]
  },
  {
    "id": "w15",
    "name": "Invicta belt",
    "price": "120 KM",
    "category": "women",
    "description": "Jedan od prvih modela koji su nastali u verziji sa tregerima koji se u ovom slučaju mogu i skidati. Inspirisati western stilom, kreiramo model koji ima dosta detalja koji na oko izgleda vrlo jednostavno. Model je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/15_INVICTA%20BELT_%20120%20KM/10.webp",
        "preview": "/Womens%20Belts/15_INVICTA%20BELT_%20120%20KM/10.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/15_INVICTA%20BELT_%20120%20KM/189257.webp",
        "preview": "/Womens%20Belts/15_INVICTA%20BELT_%20120%20KM/189257.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/15_INVICTA%20BELT_%20120%20KM/viber_image_2020-12-10_20-58-10.webp",
        "preview": "/Womens%20Belts/15_INVICTA%20BELT_%20120%20KM/viber_image_2020-12-10_20-58-10.webp"
      }
    ]
  },
  {
    "id": "w16",
    "name": "Nefertiti belt",
    "price": "120 KM",
    "category": "women",
    "description": "Model koji je jedan od najprodavajnijih modela. Blagi luk na kukovima dodatno naglašava žensku figuru dok se vezanjem na prednjem dijelu kaiša, dodatno podešava veličina. Model je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/16_NEFERTITI%20BELT_%20120%20KM/101.webp",
        "preview": "/Womens%20Belts/16_NEFERTITI%20BELT_%20120%20KM/101.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/16_NEFERTITI%20BELT_%20120%20KM/106.webp",
        "preview": "/Womens%20Belts/16_NEFERTITI%20BELT_%20120%20KM/106.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/16_NEFERTITI%20BELT_%20120%20KM/199925.webp",
        "preview": "/Womens%20Belts/16_NEFERTITI%20BELT_%20120%20KM/199925.webp"
      }
    ]
  },
  {
    "id": "w17",
    "name": "Tena belt",
    "price": "45 KM",
    "category": "women",
    "description": "Basic kaiš sa unakrsnim vezivanjem.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/17_TENA%20BELT_%2045%20KM/9.webp",
        "preview": "/Womens%20Belts/17_TENA%20BELT_%2045%20KM/9.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/17_TENA%20BELT_%2045%20KM/19.webp",
        "preview": "/Womens%20Belts/17_TENA%20BELT_%2045%20KM/19.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/17_TENA%20BELT_%2045%20KM/189140.webp",
        "preview": "/Womens%20Belts/17_TENA%20BELT_%2045%20KM/189140.webp"
      }
    ]
  },
  {
    "id": "w18",
    "name": "Adrienne belt",
    "price": "80 KM",
    "category": "women",
    "description": "Vrlo jednostavan kaiš sa nešto manjim lukom na kukovima. Veličinu podešava sa dvije kopče.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/18_ADRIENN%20BELT_%2080%20KM/189252.webp",
        "preview": "/Womens%20Belts/18_ADRIENN%20BELT_%2080%20KM/189252.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/18_ADRIENN%20BELT_%2080%20KM/189314.webp",
        "preview": "/Womens%20Belts/18_ADRIENN%20BELT_%2080%20KM/189314.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/18_ADRIENN%20BELT_%2080%20KM/189318.webp",
        "preview": "/Womens%20Belts/18_ADRIENN%20BELT_%2080%20KM/189318.webp"
      }
    ]
  },
  {
    "id": "w19",
    "name": "Afrodita belt",
    "price": "120 KM",
    "category": "women",
    "description": "Model koji izradom ima slične karakteristike kao korzet. Kruti i čvrsti materijal koji je dozvoljava puno prostora za mijenjanje veličine. Kopča se za jednom kopčom na stražnjoj strani. Model je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/19_%20AFRODITA%20BELT%20_%20120%20KM/32.webp",
        "preview": "/Womens%20Belts/19_%20AFRODITA%20BELT%20_%20120%20KM/32.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/19_%20AFRODITA%20BELT%20_%20120%20KM/189299.webp",
        "preview": "/Womens%20Belts/19_%20AFRODITA%20BELT%20_%20120%20KM/189299.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/19_%20AFRODITA%20BELT%20_%20120%20KM/189300.webp",
        "preview": "/Womens%20Belts/19_%20AFRODITA%20BELT%20_%20120%20KM/189300.webp"
      }
    ]
  },
  {
    "id": "w20",
    "name": "Alba belt",
    "price": "70 KM",
    "category": "women",
    "description": "Model koji sa svojom jednostavnošću govori mnogo toga. Veoma elegantan, ali istovremeno i snažan modni dodatak.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/20_ALBA%20BELT%20_%2070%20KM/189294.webp",
        "preview": "/Womens%20Belts/20_ALBA%20BELT%20_%2070%20KM/189294.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/20_ALBA%20BELT%20_%2070%20KM/189295.webp",
        "preview": "/Womens%20Belts/20_ALBA%20BELT%20_%2070%20KM/189295.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/20_ALBA%20BELT%20_%2070%20KM/189296.webp",
        "preview": "/Womens%20Belts/20_ALBA%20BELT%20_%2070%20KM/189296.webp"
      }
    ]
  },
  {
    "id": "w21",
    "name": "Salvia belt",
    "price": "45 KM",
    "category": "women",
    "description": "Neobičan, a jednostavan. Kopčanje preko malih nitnica sa strana kaiša, a najveći akcent ostavlja centralni krug.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/21_SALVIA%20BELT_45%20KM/147067.webp",
        "preview": "/Womens%20Belts/21_SALVIA%20BELT_45%20KM/147067.webp"
      }
    ]
  },
  {
    "id": "w22",
    "name": "Lily belt",
    "price": "60 KM",
    "category": "women",
    "description": "Model koji odgovara poslovnom outfitu. Vezanje je isključivo kožom, bez ikakve kopče.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/22_%20LILY%20BELT_60%20KM/147070.webp",
        "preview": "/Womens%20Belts/22_%20LILY%20BELT_60%20KM/147070.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/22_%20LILY%20BELT_60%20KM/210215.webp",
        "preview": "/Womens%20Belts/22_%20LILY%20BELT_60%20KM/210215.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/22_%20LILY%20BELT_60%20KM/210232.webp",
        "preview": "/Womens%20Belts/22_%20LILY%20BELT_60%20KM/210232.webp"
      }
    ]
  },
  {
    "id": "w23",
    "name": "Zinnia belt",
    "price": "60 KM",
    "category": "women",
    "description": "Model koji nastaje kombinacijom kože i marame. Maramu možete odabrati iz naše kolekcije ili iskombinirati sa svojom.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/23_ZINNIA%20BELT_60%20KM/147071.webp",
        "preview": "/Womens%20Belts/23_ZINNIA%20BELT_60%20KM/147071.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/23_ZINNIA%20BELT_60%20KM/147075.webp",
        "preview": "/Womens%20Belts/23_ZINNIA%20BELT_60%20KM/147075.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/23_ZINNIA%20BELT_60%20KM/210219.webp",
        "preview": "/Womens%20Belts/23_ZINNIA%20BELT_60%20KM/210219.webp"
      }
    ]
  },
  {
    "id": "w24",
    "name": "Rose belt",
    "price": "120 KM",
    "category": "women",
    "description": "Model kojeg je moguće izraditi i bez tregera. Inspirisan western filmovima i neobičnim nošnjama. Model je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/24_ROSE%20BELT%20120%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.39_7727d72d.webp",
        "preview": "/Womens%20Belts/24_ROSE%20BELT%20120%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.39_7727d72d.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/24_ROSE%20BELT%20120%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.39_fd94a5c8.webp",
        "preview": "/Womens%20Belts/24_ROSE%20BELT%20120%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.39_fd94a5c8.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/24_ROSE%20BELT%20120%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.40_d47364bb.webp",
        "preview": "/Womens%20Belts/24_ROSE%20BELT%20120%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.40_d47364bb.webp"
      }
    ]
  },
  {
    "id": "w25",
    "name": "Grace belt",
    "price": "55 KM",
    "category": "women",
    "description": "Model sa jednom kopčom koji se dva puta omota oko struka. Dodatni twist je detalj na kraju kaiša koji se može i ukloniti.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/25_GRACE%20BELT_%2055%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.38_1c0c23a1.webp",
        "preview": "/Womens%20Belts/25_GRACE%20BELT_%2055%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.38_1c0c23a1.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/25_GRACE%20BELT_%2055%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.38_48926d46.webp",
        "preview": "/Womens%20Belts/25_GRACE%20BELT_%2055%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.38_48926d46.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/25_GRACE%20BELT_%2055%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.39_e3c6d7ee.webp",
        "preview": "/Womens%20Belts/25_GRACE%20BELT_%2055%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.39_e3c6d7ee.webp"
      }
    ]
  },
  {
    "id": "w26",
    "name": "Nika belt",
    "price": "75 KM",
    "category": "women",
    "description": "Model koji je najprodavaniji ljeti jer najveći efekt ima kada je proizveden u jarkim bojama. Dosta sličan Teja belt-u, samo što se vezanje nalazi tačno ispod grudi i ima dva unakrsna kaišića.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/26_NIKA%20BELT_%2075%20KM/n2.webp",
        "preview": "/Womens%20Belts/26_NIKA%20BELT_%2075%20KM/n2.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/26_NIKA%20BELT_%2075%20KM/n7.webp",
        "preview": "/Womens%20Belts/26_NIKA%20BELT_%2075%20KM/n7.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/26_NIKA%20BELT_%2075%20KM/n15.webp",
        "preview": "/Womens%20Belts/26_NIKA%20BELT_%2075%20KM/n15.webp"
      }
    ]
  },
  {
    "id": "w27",
    "name": "Iris belt",
    "price": "90 KM",
    "category": "women",
    "description": "Samo za smjele, odvažne, unikatne i slobodne dame. Uz obični kaiš niz nogu se vežu i dodaci za vezivanje na nogama koji se mogu i skinuti. Model je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/27_%20IRIS%20BELT%20_90%20KM/203148.webp",
        "preview": "/Womens%20Belts/27_%20IRIS%20BELT%20_90%20KM/203148.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/27_%20IRIS%20BELT%20_90%20KM/203151.webp",
        "preview": "/Womens%20Belts/27_%20IRIS%20BELT%20_90%20KM/203151.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/27_%20IRIS%20BELT%20_90%20KM/203152.webp",
        "preview": "/Womens%20Belts/27_%20IRIS%20BELT%20_90%20KM/203152.webp"
      }
    ]
  },
  {
    "id": "w28",
    "name": "Glorija belt",
    "price": "120 KM",
    "category": "women",
    "description": "Model koji je apsolutno hit. Moguće ga je nositi na dva načina. Jedan je da na prednjoj strani se nalaze ukršteni kaiševi, a drugi je da dvije kopče budu na prednjoj strani a kaišići nazad. Također, postoji mogučnost da svaki kaišić bude u drugoj boji. Model općeninto je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/28_GLORIJA%20BELT_%20120%20KM/c.webp",
        "preview": "/Womens%20Belts/28_GLORIJA%20BELT_%20120%20KM/c.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/28_GLORIJA%20BELT_%20120%20KM/d.webp",
        "preview": "/Womens%20Belts/28_GLORIJA%20BELT_%20120%20KM/d.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/28_GLORIJA%20BELT_%20120%20KM/g.webp",
        "preview": "/Womens%20Belts/28_GLORIJA%20BELT_%20120%20KM/g.webp"
      }
    ]
  },
  {
    "id": "w30",
    "name": "Inga belt",
    "price": "150 KM",
    "category": "women",
    "description": "Model koji prati poslovni outfit dame koja je uvijek spremna ostaviti trag. Dva kaišića na prednjem dijelu podešavaju veličinu u ovisnosti od odjeće. Na bokovima se kaiš blago širi što dodatno laksa svakoj figuri. Model je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/30_INGA%20BELT_150%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.35_5a04a9f2.webp",
        "preview": "/Womens%20Belts/30_INGA%20BELT_150%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.35_5a04a9f2.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/30_INGA%20BELT_150%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.35_df712a74.webp",
        "preview": "/Womens%20Belts/30_INGA%20BELT_150%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.35_df712a74.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/30_INGA%20BELT_150%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.35_f271d9c0.webp",
        "preview": "/Womens%20Belts/30_INGA%20BELT_150%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.35_f271d9c0.webp"
      }
    ]
  },
  {
    "id": "w33",
    "name": "Andrea belt",
    "price": "250 KM",
    "category": "women",
    "description": "Model idealan za bicikliste ili motoriste. Dizajniran tako da ostaje čvrsto vezan za tijelo, a dovoljno fleksibilan da u torbice stanu sve potrebne stvari za kraću ili dužu pustolovinu. Model je moguće izraditi u boji po želji",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/33_ANDREA%20BELT_%20250%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.23_98dad276.webp",
        "preview": "/Womens%20Belts/33_ANDREA%20BELT_%20250%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.23_98dad276.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/33_ANDREA%20BELT_%20250%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.27_29c7ee50.webp",
        "preview": "/Womens%20Belts/33_ANDREA%20BELT_%20250%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.27_29c7ee50.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/33_ANDREA%20BELT_%20250%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.27_d8b2b961.webp",
        "preview": "/Womens%20Belts/33_ANDREA%20BELT_%20250%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.27_d8b2b961.webp"
      }
    ]
  },
  {
    "id": "w38",
    "name": "Samantha belt",
    "price": "90 KM",
    "category": "women",
    "description": "Model koji se nosi direktno ispod grudi. Na malene krugove se kače tregeri koji se ne skidaju ali lanac koji se nalazi sa desne strane se lako može podešavati. Model je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/38_SAMANTHA%20BELT_90%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.32_fb906907.webp",
        "preview": "/Womens%20Belts/38_SAMANTHA%20BELT_90%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.32_fb906907.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/38_SAMANTHA%20BELT_90%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.33_8e53d1a1.webp",
        "preview": "/Womens%20Belts/38_SAMANTHA%20BELT_90%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.33_8e53d1a1.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/38_SAMANTHA%20BELT_90%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.33_a5bac53d.webp",
        "preview": "/Womens%20Belts/38_SAMANTHA%20BELT_90%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.33_a5bac53d.webp"
      }
    ]
  },
  {
    "id": "w39",
    "name": "Hera belt",
    "price": "100 KM",
    "category": "women",
    "description": "Model koji se nosi direktno ispod grudi. Na malene krugove se kače tregeri koji se ne skidaju ali lanac koji se nalazi sa desne strane se lako može podešavati. Model je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/39_HERA%20BELT_100%20KM/WhatsApp%20Image%202025-10-26%20at%2018.04.24_8061c11b.webp",
        "preview": "/Womens%20Belts/39_HERA%20BELT_100%20KM/WhatsApp%20Image%202025-10-26%20at%2018.04.24_8061c11b.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/39_HERA%20BELT_100%20KM/WhatsApp%20Image%202025-10-26%20at%2018.04.24_67689faf.webp",
        "preview": "/Womens%20Belts/39_HERA%20BELT_100%20KM/WhatsApp%20Image%202025-10-26%20at%2018.04.24_67689faf.webp"
      }
    ]
  },
  {
    "id": "w40",
    "name": "Klea belt",
    "price": "90 KM",
    "category": "women",
    "description": "Model koji je nastao prilagođavanjem modela Teja belta. Dva kaišića su povezani na zadnjem dijelu sa jednim jedinstvenim kaišem i tregerima koji se ne skidaju. Model je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/40_KLEA%20BELT_90%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.33_1e07919c.webp",
        "preview": "/Womens%20Belts/40_KLEA%20BELT_90%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.33_1e07919c.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/40_KLEA%20BELT_90%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.34_a7857a3c.webp",
        "preview": "/Womens%20Belts/40_KLEA%20BELT_90%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.34_a7857a3c.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/40_KLEA%20BELT_90%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.34_c198617f.webp",
        "preview": "/Womens%20Belts/40_KLEA%20BELT_90%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.34_c198617f.webp"
      }
    ]
  },
  {
    "id": "w41",
    "name": "Kleopatra belt",
    "price": "85 KM",
    "category": "women",
    "description": "Model koji u sebi kombinuje dva materijala - kožu i gumu. Koža se naprijed isprepleteno veže, a nazad se nalazi guma koja je idealna za prilagođavanje svim oblicima i veličinama tijela.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/41_KLEOPATRA%20BELT_85%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.37_5fedeea1.webp",
        "preview": "/Womens%20Belts/41_KLEOPATRA%20BELT_85%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.37_5fedeea1.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/41_KLEOPATRA%20BELT_85%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.37_8270a395.webp",
        "preview": "/Womens%20Belts/41_KLEOPATRA%20BELT_85%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.37_8270a395.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/41_KLEOPATRA%20BELT_85%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.37_e34f1363.webp",
        "preview": "/Womens%20Belts/41_KLEOPATRA%20BELT_85%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.37_e34f1363.webp"
      }
    ]
  },
  {
    "id": "w42",
    "name": "Femme belt",
    "price": "70 KM",
    "category": "women",
    "description": "Nastao za one koje vole da sve svoje stvarčice drže blizu sebe. Torbica se može skinuti pa tako ostane samo obični kaiš.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/42_FEMME%20BELT_70%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.34_4509765d.webp",
        "preview": "/Womens%20Belts/42_FEMME%20BELT_70%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.34_4509765d.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/42_FEMME%20BELT_70%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.35_0ca89a9f.webp",
        "preview": "/Womens%20Belts/42_FEMME%20BELT_70%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.35_0ca89a9f.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/42_FEMME%20BELT_70%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.36_ad8dcc00.webp",
        "preview": "/Womens%20Belts/42_FEMME%20BELT_70%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.36_ad8dcc00.webp"
      }
    ]
  },
  {
    "id": "w43",
    "name": "Demetra belt",
    "price": "90 KM",
    "category": "women",
    "description": "Model koja je nastala kao izvedenica od Klea belta. Najpraktičniji kaiš u našoj ponudi jer od jednog kaiš možete dobiti čak tri! Obični kaiš, obični kaiš sa tregerima i dva kaiša sa tregerima. Model je moguće izraditi u boji po želji",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/43_DEMETRA%20BELT_%2090%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.36_4b0dea25.webp",
        "preview": "/Womens%20Belts/43_DEMETRA%20BELT_%2090%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.36_4b0dea25.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/43_DEMETRA%20BELT_%2090%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.37_62291152.webp",
        "preview": "/Womens%20Belts/43_DEMETRA%20BELT_%2090%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.37_62291152.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/43_DEMETRA%20BELT_%2090%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.38_25afcaa7.webp",
        "preview": "/Womens%20Belts/43_DEMETRA%20BELT_%2090%20KM/WhatsApp%20Image%202025-10-26%20at%2017.42.38_25afcaa7.webp"
      }
    ]
  },
  {
    "id": "w44",
    "name": "Xena belt",
    "price": "150 KM",
    "category": "women",
    "description": "Model idealan za dame koje vole efektnost i dominantnost. Kaiš koji ostavlja najveći dojam s obzirom da svojom dužinom dominira nad outfitom. Model je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/44_XENA%20BELT_%20150%20KM/1.webp",
        "preview": "/Womens%20Belts/44_XENA%20BELT_%20150%20KM/1.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/44_XENA%20BELT_%20150%20KM/3.webp",
        "preview": "/Womens%20Belts/44_XENA%20BELT_%20150%20KM/3.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/44_XENA%20BELT_%20150%20KM/4.webp",
        "preview": "/Womens%20Belts/44_XENA%20BELT_%20150%20KM/4.webp"
      }
    ]
  },
  {
    "id": "w45",
    "name": "Teona belt",
    "price": "65 KM",
    "category": "women",
    "description": "Model prepoznatljiv po kružnom detalju kroz koji se provlači dio kaiša i tako se veže.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/45_TEONA%20BELT_65%20KM/5.webp",
        "preview": "/Womens%20Belts/45_TEONA%20BELT_65%20KM/5.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/45_TEONA%20BELT_65%20KM/6.webp",
        "preview": "/Womens%20Belts/45_TEONA%20BELT_65%20KM/6.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/45_TEONA%20BELT_65%20KM/7.webp",
        "preview": "/Womens%20Belts/45_TEONA%20BELT_65%20KM/7.webp"
      }
    ]
  },
  {
    "id": "w49",
    "name": "Sabrina belt",
    "price": "100 KM",
    "category": "women",
    "description": "Dva unakrsno polukružna kaišića koji idealno ističu struk. Efektnost se krije u boji u kojoj se može razraditi a to je svaka boja koja se nalazi u našem asortimanu.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/49_SABRINA%20BELT_100%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.43_7eafd4fe.webp",
        "preview": "/Womens%20Belts/49_SABRINA%20BELT_100%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.43_7eafd4fe.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/49_SABRINA%20BELT_100%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.43_6624f45a.webp",
        "preview": "/Womens%20Belts/49_SABRINA%20BELT_100%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.43_6624f45a.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/49_SABRINA%20BELT_100%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.43_eef2d4c1.webp",
        "preview": "/Womens%20Belts/49_SABRINA%20BELT_100%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.43_eef2d4c1.webp"
      }
    ]
  },
  {
    "id": "w50",
    "name": "Devon belt",
    "price": "85 KM",
    "category": "women",
    "description": "Jednostavan kaiš koji ima mali twist, a to je omotavanje tijela čak dva puta što dodatno daje akcent na sam model. Kači se sa dvije šnale te je isti moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/50_DEVON%20BELT_85%20KM/WhatsApp%20Image%202025-10-26%20at%2017.24.42_39bd0144.webp",
        "preview": "/Womens%20Belts/50_DEVON%20BELT_85%20KM/WhatsApp%20Image%202025-10-26%20at%2017.24.42_39bd0144.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/50_DEVON%20BELT_85%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.42_513556cc.webp",
        "preview": "/Womens%20Belts/50_DEVON%20BELT_85%20KM/WhatsApp%20Image%202025-10-26%20at%2017.38.42_513556cc.webp"
      }
    ]
  },
  {
    "id": "w51",
    "name": "Leon belt",
    "price": "120 KM",
    "category": "women",
    "description": "Model koji je najprodavajniji kaiš u 2025.godini. U njegovoj originalnoj verziji uz njega se nalazi i mala okrugla torbica, koja se skida i time dobijemo ponovno skroz drugačiji izgled kaiša. Model je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/51_LEON%20BELT_120%20KM/01-leon-belt-front.webp",
        "preview": "/Womens%20Belts/51_LEON%20BELT_120%20KM/01-leon-belt-front.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/51_LEON%20BELT_120%20KM/02-leon-belt-detail.webp",
        "preview": "/Womens%20Belts/51_LEON%20BELT_120%20KM/02-leon-belt-detail.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/51_LEON%20BELT_120%20KM/03-leon-belt-onbody.webp",
        "preview": "/Womens%20Belts/51_LEON%20BELT_120%20KM/03-leon-belt-onbody.webp"
      }
    ]
  },
  {
    "id": "w52",
    "name": "Domina belt",
    "price": "150 KM",
    "category": "women",
    "description": "Kao što mu i ime kaže, Domina belt je kaiš koji idealno naglašava struk, a opet prikriva dijelove tijela kojeg ne želite da istaknete. Sa kaišićem ispred, ima dodatnu fleksibilnost i mogućnost prilagođavanja svakom outfitu. Model je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/52_DOMINA%20BELT_150%20KM/WhatsApp%20Image%202025-10-14%20at%2023.08.27_ce57225e.webp",
        "preview": "/Womens%20Belts/52_DOMINA%20BELT_150%20KM/WhatsApp%20Image%202025-10-14%20at%2023.08.27_ce57225e.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/52_DOMINA%20BELT_150%20KM/WhatsApp%20Image%202025-10-14%20at%2023.08.28_f15d0e33.webp",
        "preview": "/Womens%20Belts/52_DOMINA%20BELT_150%20KM/WhatsApp%20Image%202025-10-14%20at%2023.08.28_f15d0e33.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/52_DOMINA%20BELT_150%20KM/WhatsApp%20Image%202025-10-14%20at%2023.08.29_bf00c09c.webp",
        "preview": "/Womens%20Belts/52_DOMINA%20BELT_150%20KM/WhatsApp%20Image%202025-10-14%20at%2023.08.29_bf00c09c.webp"
      }
    ]
  },
  {
    "id": "w53",
    "name": "Suzana belt",
    "price": "150 KM",
    "category": "women",
    "description": "Model koji prema srednjem dijelu se blago spušta u špic i time se prilagođava tijelu. Svoju veličinu podešava kaišićima sa bokova. Model je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/53_SUZANA%20BELT_150%20KM/11.webp",
        "preview": "/Womens%20Belts/53_SUZANA%20BELT_150%20KM/11.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/53_SUZANA%20BELT_150%20KM/13.webp",
        "preview": "/Womens%20Belts/53_SUZANA%20BELT_150%20KM/13.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/53_SUZANA%20BELT_150%20KM/14.webp",
        "preview": "/Womens%20Belts/53_SUZANA%20BELT_150%20KM/14.webp"
      }
    ]
  },
  {
    "id": "w54",
    "name": "Lores belt",
    "price": "85 KM",
    "category": "women",
    "description": "Još jedan model inspirisan western filmovima. Neravni, obli, fluidni rubovi i široka prednja kopča idealan su spoj jednostavnog i elegantnog modnog dodatka.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/54_LORES%20BELT_85%20KM/01.webp",
        "preview": "/Womens%20Belts/54_LORES%20BELT_85%20KM/01.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/54_LORES%20BELT_85%20KM/02.webp",
        "preview": "/Womens%20Belts/54_LORES%20BELT_85%20KM/02.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/54_LORES%20BELT_85%20KM/03.webp",
        "preview": "/Womens%20Belts/54_LORES%20BELT_85%20KM/03.webp"
      }
    ]
  },
  {
    "id": "w65",
    "name": "Lana belt",
    "price": "60 KM",
    "category": "women",
    "description": "Model je definitivno namijenjen za smjele dame koje vole biti drugačije.\nModel je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/65_LANA%20BELT_60%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.38_2b15d1e9.webp",
        "preview": "/Womens%20Belts/65_LANA%20BELT_60%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.38_2b15d1e9.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/65_LANA%20BELT_60%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.38_ed2edb14.webp",
        "preview": "/Womens%20Belts/65_LANA%20BELT_60%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.38_ed2edb14.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/65_LANA%20BELT_60%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.39_64bedae9.webp",
        "preview": "/Womens%20Belts/65_LANA%20BELT_60%20KM/WhatsApp%20Image%202025-10-26%20at%2017.52.39_64bedae9.webp"
      }
    ]
  },
  {
    "id": "w66",
    "name": "Zana belt",
    "price": "180 KM",
    "category": "women",
    "description": "Model koji definitivno privlači poglede. Ekstravagantan, drugačiji i poseban. Učvršćen sa tregerima a ukrašen sa perjem idealan za neobične događaje. Model je moguće izraditi u boji po želji.",
    "colors": [
      {
        "label": "Photo 1",
        "image": "/Womens%20Belts/66_ZANA%20BELT_180%20KM/WhatsApp%20Image%202025-10-14%20at%2023.08.56_0e7f4836.webp",
        "preview": "/Womens%20Belts/66_ZANA%20BELT_180%20KM/WhatsApp%20Image%202025-10-14%20at%2023.08.56_0e7f4836.webp"
      },
      {
        "label": "Photo 2",
        "image": "/Womens%20Belts/66_ZANA%20BELT_180%20KM/WhatsApp%20Image%202025-10-14%20at%2023.08.57_9211c123.webp",
        "preview": "/Womens%20Belts/66_ZANA%20BELT_180%20KM/WhatsApp%20Image%202025-10-14%20at%2023.08.57_9211c123.webp"
      },
      {
        "label": "Photo 3",
        "image": "/Womens%20Belts/66_ZANA%20BELT_180%20KM/WhatsApp%20Image%202025-10-14%20at%2023.18.28_ff4790f9.webp",
        "preview": "/Womens%20Belts/66_ZANA%20BELT_180%20KM/WhatsApp%20Image%202025-10-14%20at%2023.18.28_ff4790f9.webp"
      }
    ]
  },
];
