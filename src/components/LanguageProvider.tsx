'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';

const translations = {
  bs: {
    nav: {
      home: 'Po\u010detna',
      belts: 'Kai\u0161evi',
      bags: 'Torbe',
      wallets: 'Nov\u010danici',
      accessories: 'Dodaci',
      about: 'O nama',
      loyalty: 'Program lojalnosti',
      contact: 'Kontakt',
      contactCta: 'Kontaktiraj nas',
      languageToggle: 'EN',
      languageToggleAria: 'Prebaci na engleski',
      follow: 'Pratite nas',
    },
    search: {
      openLabel: 'Otvori pretragu',
      modalLabel: 'Pretraga proizvoda',
      placeholder: 'Pretra\u017ei kai\u0161eve, torbe, nov\u010danike\u2026',
      inputLabel: 'Pretraga proizvoda',
      closeLabel: 'Zatvori pretragu',
      noResults: 'Nije prona\u0111en rezultat za',
      noImage: 'Bez slike',
      backToHome: 'Nazad na po\u010detnu',
      categoryLabels: {
        womensBelts: '\u017denski kai\u0161',
        mensBelts: 'Mu\u0161ki kai\u0161',
        bags: 'Torba',
        wallets: 'Nov\u010danik',
        accessories: 'Dodatak',
      },
    },
    hero: {
      title: 'Prvi bosanskohercegova\u010dki brend ko\u017enih dodataka',
      subtitle:
        'Spoj tradicije, kreativnosti i znanja u jednom modnom dodatku.',
      cta: 'Istra\u017ei kolekciju',
    },
    home: {
      mobileTilesButton: 'Pogledaj sve',
    },
    products: {
      availabilityLabel: 'Dostupno u više boja',
      descriptions: {},
    },
    gallery: {
      title: 'Unutar Boa studija',
      subtitle:
        'Povuci u stranu i zaviri u teksture, alate i gotove komade nastale tokom posljednjih narud\u017ebi.',
      items: [
        {
          title: 'Ru\u010dni burni\u0161 rubova',
          description: 'Svaki rub je zatvoren i ispoliran kako bi ostao gladak i otporan na habanje.',
        },
        {
          title: 'Rezanje kai\u0161eva po mjeri',
          description: 'Precizni no\u017eevi dr\u017ee svaki remen potpuno prav prije nego \u0161to krenu prvi \u0161avovi.',
        },
        {
          title: 'Biranje okova',
          description: 'Masivne mesingane kop\u010de biramo prema tonu i te\u017eini svake ko\u017ee.',
        },
        {
          title: '\u0160ivenje saddle \u0161avom',
          description: 'Saddle \u0161avovi zaklju\u010davaju konac i ostaju \u010dvrsti \u010dak i pri svakodnevnom naprezanju.',
        },
        {
          title: 'Zavr\u0161ena kolekcija kai\u0161eva',
          description: 'Pogled na kai\u0161eve koji \u010dekaju zavr\u0161nu kontrolu i pakovanje.',
        },
      ],
      controls: {
        previous: 'Pomjeri galeriju unazad',
        next: 'Pomjeri galeriju naprijed',
      },
    },
    about: {
      title: 'Izra\u0111eno u Travniku, Bosna i Hercegovina',
      body:
        'Boa Belts spaja tradicionalne ko\u017earske vje\u0161tine s modernim dizajnom kako bi stvorio izdr\u017eljive komade koji s vremenom postaju jo\u0161 ljep\u0161i. Svaki proizvod se re\u017ee, \u0161ije i zavr\u0161ava u Travniku, pa nastaju predmeti puni karaktera spremni za svakodnevnu upotrebu.',
      ctaLabel: 'Saznaj vi\u0161e o nama',
    },
    belts: {
      title: 'Kai\u0161evi koji podi\u017eu svaki izgled',
      cards: [
        {
          title: 'Ru\u010dna zavr\u0161na obrada',
          description:
            'Svaki kai\u0161 se ru\u010dno re\u017ee, polira i \u0161ije kako bi dobio bogatu patinu i dugotrajnu izdr\u017eljivost.',
        },
        {
          title: 'Izrada po mjeri',
          description:
            'Prilago\u0111ene du\u017eine i raspored rupica koji odgovaraju svakoj garderobi, od farmerki do odijela.',
        },
        {
          title: 'Premium ko\u017ea',
          description:
            'Ko\u017ea punog zrna iz evropskih \u0161tavionica pru\u017ea meko\u0107u i dubinu boje.',
        },
        {
          title: 'Ekskluzivna kop\u010da',
          description:
            'Masivne mesingane i ner\u0111aju\u0107e kop\u010de birane zbog te\u017eine, karaktera i dugotrajnog sjaja.',
        },
      ],
      ctaLabel: 'Pogledaj kolekciju',
    },
    bags: {
      title: 'Torbe koje pri\u010daju va\u0161u pri\u010du',
      cards: [
        {
          title: 'Tote torbe',
          description:
            'Prostrane tote torbe sa oja\u010danim ru\u010dkama i stabilnim dnom spremne za gradske obaveze i pijacu.',
        },
        {
          title: 'Crossbody modeli',
          description:
            'Tanke crossbody siluete ostavljaju ruke slobodnim, dok precizno \u0161ivenje i unutra\u0161nji d\u017eepovi \u010duvaju osnovne stvari.',
        },
        {
          title: 'Torbe za put',
          description:
            'Vikend torbe i ran\u010devi postavljeni izdr\u017eljivim platnom spremni su za kratka putovanja i svakodnevnu vo\u017enju.',
        },
      ],
      ctaLabel: 'Izaberi svoju torbu',
    },
    wallets: {
      title: 'Nov\u010danici za minimalisti\u010dki stil',
      cta: 'Saznaj vi\u0161e',
      cards: [
        {
          title: 'Tanak profil',
          description: 'Minimalisti\u010dke futrole za kartice koje ne stvaraju dodatni volumen u d\u017eepu.',
        },
        {
          title: 'Sigurno \u0161ivenje',
          description: 'Saddle \u0161avovi otporni na svakodnevno kori\u0161tenje koji dr\u017ee rubove \u010dvrstim godinama.',
        },
        {
          title: 'Organizovana unutra\u0161njost',
          description: 'Pregrade prilago\u0111ene va\u0161im karticama, gotovini i sitnicama.',
        },
      ],
      ctaLabel: 'Pregledaj nov\u010danike i dodatke',
    },
    contactSection: {
      title: 'Recite nam \u0161ta da izradimo',
      description:
        'Popunite formu i tim Boa Belts pomo\u0107i \u0107e vam da odaberete pravi proizvod ili planirate narud\u017ebu po mjeri.',
      form: {
        firstName: 'Ime*',
        lastName: 'Prezime*',
        phoneNumber: 'Broj telefona',
        preferredProduct: '\u017deljeni proizvod',
        email: 'Email*',
        interest: '\u0160ta vas zanima?*',
        selectPlaceholder: '-- Molimo odaberite opciju --',
        options: {
          belt: 'Kai\u0161',
          bag: 'Torba',
          wallet: 'Nov\u010danik ili dr\u017ea\u010d kartica',
        },
        messageLabel: 'Opi\u0161ite svoju ideju*',
        submit: 'Po\u0161alji upit',
      },
    },
    followLinks: {
      instagram: 'Instagram',
      facebook: 'Facebook',
    },
    footer: {
      description:
        'Prvi bosanskohercegova\u010dki brend ru\u010dno ra\u0111enih ko\u017eenih kai\u0161eva koji odnedavno \u0161iri svoj asortiman i na druge modne dodatke. Nastanjeni u Travniku, ovaj brend iza sebe krije i izuzetno lijepu porodi\u010dnu pri\u010du koja se gradi korak po korak. Kroz svaki napravljeni i isporu\u010deni dodatak pokazujemo svoju ljubav prema onome \u0161to radimo. Utkani u svaku poru, i proizvodi pri\u010daju svoju pri\u010du. Otkrijte i Vi o \u010demu je rije\u010d!',
      navigationTitle: 'Kategorije',
      navigationTitle1: 'O nama',
      contactTitle: 'Kontakt',
      followTitle: 'Pratite nas',
      location: 'Travnik, Bosna i Hercegovina',
      copyright: 'Boa Belts. Sva prava zadr\u017eana.',
    },
    loyalty: {
      badge: 'Loyalty kartica',
      title: 'Upoznaj Boa Loyalty karticu',
      subtitle:
        'Svaka narud\u017eba te vodi do ve\u0107ih pogodnosti i pa\u017eljivo biranih iznena\u0111enja.',
      perks: [
        'Karticu dobija\u0161 ve\u0107 prilikom prve prijave i prve kupovine.',
        'Tre\u0107a narud\u017eba: 15% popusta.',
        '\u0160esta narud\u017eba: iznena\u0111enje iz na\u0161eg studija.',
        'Deveta narud\u017eba: 25% popusta.',
        'Dvanaesta narud\u017eba: iznena\u0111enje uz tvoju isporuku.',
        'Petnaesta narud\u017eba: 50% popusta.',
        'Osamnaesta narud\u017eba: posebno iznena\u0111enje iz radionice.',
      ],
      note: 'Loyalty kartica vrijedi od danas pa sve do daljnjeg. Iznos potro\u0161nje nije ograni\u010den.',
      cta: 'Saznaj vi\u0161e o loyalty programu',
    },
    beltsPage: {
      heroTitle: 'Kai\u0161evi koji podi\u017eu svaki outfit',
      heroSubtitle:
        'Izrada od kvalitetne, prirodne premium ko\u017ee. Pogodna za sve stilove i ukuse.',
      heroCta: 'Pogledaj kolekciju',
      craftsmanshipTitle: 'Kai\u0161evi \u2013 stil koji traje',
      craftsmanshipParagraphs: [
        'Na\u0161i kai\u0161evi nisu samo dodatak \u2013 oni su klju\u010dni akcenat va\u0161eg izgleda. Od casual farmerki do odijela \u2013 izra\u0111eni su da prate va\u0161 stil i s vremenom dobijaju karakter.',
      ],
      highlightTitle: 'Detalji koji \u010dine razliku',
      highlightItems: [
        {
          title: 'Premium ko\u017ea punog zrna',
          description: 'S pa\u017eljivo odabranih evropskih \u0161tavionica za dubinu boje i izdr\u017eljivost.',
        },
        {
          title: 'Ru\u010dno obra\u0111eni rubovi',
          description: 'Rezani rukom i fini\u0161irani burnish efektom za ugla\u0111en osje\u0107aj pri svakom no\u0161enju.',
        },
        {
          title: 'Masivne kop\u010de',
          description: 'Te\u017eina i sjaj koji odra\u017eavaju kvalitet izrade i ostaju postojani godinama.',
        },
        {
          title: 'Izrada po mjeri',
          description: 'Du\u017eina i raspored rupica koje prilago\u0111avamo tvojoj garderobi.',
        },
      ],
      sizingTitle: 'Vodi\u010d za mjerenje',
      sizingText: 'Svaki kai\u0161 krojimo prema va\u0161oj \u017eelji. Odaberite na\u010din koji vam najvi\u0161e odgovara:',
      sizingPoints: [
        'Po\u0161aljite obim struka i bokova za kai\u0161 koji pristaje u vi\u0161e polo\u017eaja.',
        'Donesite omiljeni kai\u0161 i mi \u0107emo kopirati njegovo pristajanje.',
        'Zaka\u017eite kratki poziv da vas vodimo kroz proces mjerenja.',
      ],
      careTitle: 'Njega kai\u0161a',
      careSteps: [
        'Nakon no\u0161enja prebri\u0161ite pra\u0161inu mekom krpom.',
        'Dva puta godi\u0161nje nanesite neutralni balzam za ko\u017eu.',
        '\u010cuvajte kai\u0161eve blago urolane kako biste izbjegli lomljenje.',
      ],
      closingTitle: 'Kai\u0161 koji pri\u010da tvoj stil',
      closingText:
        'Birajte kai\u0161 koji se ne povla\u010di\u2014on u\u010destvuje u va\u0161em izra\u017eavanju.',
      closingButton: 'Pokreni upit za kai\u0161',
      categoryMenu: {
        womens: '\u017denski',
        mens: 'Mu\u0161ki',
      },
      sections: {
        womens: {
          title: '\u017denski kai\u0161evi',
          subtitle: 'Deset modela prilago\u0111enih \u017eenskoj silueti.',
        },
        mens: {
          title: 'Mu\u0161ki kai\u0161evi',
          subtitle: 'Deset izdr\u017eljivih modela za mu\u0161karce.',
        },
        stylesLabel: 'modela',
      },
      card: {
        availabilityLabel: 'Dostupno u više boja',
        craftedBadge: 'Ru\u010dno izra\u0111eno',
        selectColorLabel: 'Odaberi {color} za {product}',
        infoAriaLabel: 'Pogledaj opis za {product}',
        variantLabel: '{variant} varijanta',
        closeLabel: 'Zatvori',
        closeAria: 'Zatvori opis',
      },
      sort: {
        label: 'Sortiraj',
        options: {
          asc: 'Najni\u017ea cijena prvo',
          desc: 'Najvi\u0161a cijena prvo',
        },
      },
    },
    bagsPage: {
      heroTitle: 'Torbe koje prate va\u0161 ritam',
      heroSubtitle:
        'Na\u0161a kolekcija je zami\u0161ljena za grad, putovanja i svakodnevnicu. Bilo da tra\u017eite strukturu tote torbe za posao, crossbody model za \u0161etnju ili vikend torbu za kratki odmor \u2013 prona\u0107i \u0107ete je kod nas.',
      heroCta: 'Izaberi svoju torbu',
      craftsmanshipTitle: 'Torbe koje prate tvoj ritam',
      craftsmanshipParagraphs: [
        'Premium ko\u017ea i izdr\u017eljivi tekstil oblikovani su za dinamiku dana: posao, \u0161etnju, putovanje i povratak ku\u0107i.',
      ],
      highlightTitle: 'Detalji koji nose pri\u010du',
      highlightItems: [
        {
          title: 'Premium materijali',
          description: 'Ko\u017ea koja pri\u010da pri\u010du i tekstil koji bez problema podnose svakodnevnu upotrebu.',
        },
        {
          title: 'Pa\u017eljivo birani detalji',
          description: 'Oja\u010dane ru\u010dke, stabilno dno i uredni \u0161avovi dr\u017ee sve na svom mjestu.',
        },
        {
          title: 'Balans funkcije i estetike',
          description: 'Dizajn koji elegantno spaja prakti\u010dnost i stil u svakoj situaciji.',
        },
      ],
      materialsTitle: 'Materijali',
      materialsList: [
        'Ko\u017ea punog zrna u prirodnim, kesten i tamnim tonovima.',
        'Antikni mesing koji prate topli sjaj na\u0161ih kai\u0161eva.',
        'Opciona podstava od filca ili umjetnog krzna za tehniku ili foto opremu.',
      ],
      collectionTitle: 'Kolekcija torbi',
      collectionSubtitle:
        'Dvadeset ru\u010dno ra\u0111enih torbi \u2014 od tote modela do vikendera \u2014 na jednom mjestu.',
      stylesLabel: 'modela',
      categoryMenu: {
        daily: 'Za svaki dan',
        travel: 'Za putovanja',
      },
      sections: {
        daily: {
          title: 'Torbe za svakodnevnicu',
          subtitle: 'Deset dizajna spremnih za posao, kafu i ve\u010dernji izlazak.',
        },
        travel: {
          title: 'Putne torbe i vikenderi',
          subtitle: 'Deset prostranih modela pripremljenih za letove, vo\u017enje i opremu.',
        },
        stylesLabel: 'modela',
      },
      card: {
        availabilityLabel: 'Dostupno u više boja',
        craftedBadge: 'Ru\u010dno izra\u0111eno',
        selectColorLabel: 'Odaberi {color} za {product}',
        infoAriaLabel: 'Pogledaj opis za {product}',
        variantLabel: '{variant} varijanta',
        closeLabel: 'Zatvori',
        closeAria: 'Zatvori opis',
      },
      sort: {
        label: 'Sortiraj',
        options: {
          asc: 'Najni\u017ea cijena prvo',
          desc: 'Najvi\u0161a cijena prvo',
        },
      },
      closingTitle: 'Torba koja nosi tvoj stil',
      closingText:
        'Odaberite torbu koja ne nosi samo stvari \u2013 ve\u0107 nosi stil.',
      closingButton: 'Planiraj torbu s nama',
    },
    walletsPage: {
      heroTitle: 'Nov\u010danici \u2013 minimalisti\u010dki pristup, maksimalna izdr\u017eljivost',
      heroSubtitle:
        'Tanak profil koji stane u d\u017eep, ali dovoljno organizovan da sve kartice, gotovina i sitnice imaju svoje mjesto.',
      heroCta: 'Saznaj vi\u0161e',
      signatureTitle: 'Detalji koji prave razliku',
      signatureItems: [
        {
          title: 'Saddle \u0161avovi',
          description: 'Ru\u010dno \u0161iveni \u0161avovi koji dr\u017ee formu i nakon godina kori\u0161tenja.',
        },
        {
          title: 'Odabrani materijali',
          description: 'Vrhunska ko\u017ea spolja i iznutra za postojanost i elegantan izgled.',
        },
        {
          title: 'Minimalisti\u010dke forme',
          description: 'Tanki profili koji i dalje organizuju kartice, gotovinu i sitnice.',
        },
      ],
      customisationTitle: 'Opcije prilago\u0111avanja',
      customisationList: [
        'Ru\u010dni burni\u0161 ili boja ruba u nijansi koja odgovara va\u0161em stilu.',
        'Utiskivanje inicijala ili lasersko graviranje na unutra\u0161njim panelima.',
        'Kontrastni saddle \u0161av u boji koja prati va\u0161 postoje\u0107i pribor.',
      ],
      heroParagraphs: [
        'Minimalizam bez kompromisa: sve \u0161to vam treba staje u d\u017eep, a ostaje organizovano i za\u0161ti\u0107eno.',
        'Zavirite u dodatke koji funkcioni\u0161u \u2013 i izgledaju odli\u010dno.',
      ],
      collectionTitle: 'Kolekcija nov\u010danika',
      collectionSubtitle:
        'Dvadeset modela ru\u010dno izra\u0111enih futrola, nov\u010danika i organizatora na jednom mjestu.',
      stylesLabel: 'rasporeda',
      careTitle: 'Njega u tri koraka',
      careSteps: [
        'Za\u0161titite nov\u010danik od vlage; ako pokisne, nje\u017eno ga osu\u0161ite.',
        'Svakih \u0161est mjeseci nanesite malu koli\u010dinu neutralne kreme.',
        'Povremeno zamijenite raspored kartica kako bi se pritisak ravnomjerno rasporedio.',
      ],
      categoryMenu: {
        slim: 'Kartice',
        carry: 'Organizatori',
      },
      sections: {
        slim: {
          title: 'Futrole za kartice',
          subtitle: 'Deset ultra tankih modela za kartice i malo gotovine.',
        },
        carry: {
          title: 'Organizatori i putni nov\u010danici',
          subtitle: 'Deset rasporeda za paso\u0161e, telefone i bilje\u0161ke.',
        },
        stylesLabel: 'rasporeda',
      },
      card: {
        availabilityLabel: 'Dostupno u više boja',
        craftedBadge: 'Ru\u010dno izra\u0111eno',
        selectColorLabel: 'Odaberi {color} za {product}',
        infoAriaLabel: 'Pogledaj opis za {product}',
        variantLabel: '{variant} varijanta',
        closeLabel: 'Zatvori',
        closeAria: 'Zatvori opis',
      },
      sort: {
        label: 'Sortiraj',
        options: {
          asc: 'Najni\u017ea cijena prvo',
          desc: 'Najvi\u0161a cijena prvo',
        },
      },
      loyalty: {
        badge: 'Loyalty kartica',
        title: 'Upoznaj Boa Loyalty karticu',
        subtitle: 'Svaka tre\u0107a narud\u017eba donosi popust ili malo iznena\u0111enje.',
        perks: [
          '1. kupovina: kartica na tvoje ime.',
          '3. kupovina: 15% popusta.',
          '6. kupovina: iznena\u0111enje iz studija.',
          '9. kupovina: 25% popusta i poseban dodatak.',
        ],
        note: 'Kartica vrijedi neograni\u010deno i ne tra\u017ei minimalan iznos narud\u017ebe.',
      },
      closingTitle: 'Minimalizam koji traje',
      closingText:
        'Zavirite u dodatke koji funkcioni\u0161u \u2013 i izgledaju odli\u010dno.',
      closingButton: 'Zapo\u010dni upit za nov\u010danik',
    },
    accessoriesPage: {
      heroTitle: 'Dodaci',
      heroHeading: 'Ko\u017eni dodaci koji prate tvoj stil',
      heroSubtitle:
        'Omoti, narukvice i futrole su mali detalji koji zaokru\u017euju \u010ditavu pri\u010du.',
      heroParagraphs: [
        'Svaki dodatak je ra\u0111en uz istu ru\u010dnu obradu kao i kai\u0161evi, a njegova patika s vremenom postaje sve prirodnija i sjajnija.',
      ],
      collectionTitle: 'Kolekcija dodataka',
      collectionSubtitle: 'Pet ru\u010dno izra\u0111enih dodataka spremnih za poklanjanje ili svakodnevnu upotrebu.',
      stylesLabel: 'komada',
      card: {
        availabilityLabel: 'Dostupno u više boja',
        craftedBadge: 'Ru\u010dno izra\u0111eno',
        selectColorLabel: 'Odaberi {color} za {product}',
        infoAriaLabel: 'Pogledaj opis za {product}',
        variantLabel: '{variant} varijanta',
        closeLabel: 'Zatvori',
        closeAria: 'Zatvori opis',
      },
      sort: {
        label: 'Sortiraj',
        options: {
          asc: 'Najni\u017ea cijena prvo',
          desc: 'Najvi\u0161a cijena prvo',
        },
      },
    },
    aboutPage: {
      heroTitle: 'O nama',
      introParagraphs: [
        'Boa Belts je nastao uz jednu \u0161iva\u0107u ma\u0161inu, ne\u0161to ve\u0107i komad ko\u017ee i viziju da svakodnevni predmeti zaslu\u017euju pa\u017enju kao porodi\u010dno naslije\u0111e. Dugotrajnost i kvalitet postaje zvijezda vodilja i otvara put kreativnosti i slobode. Danas, i dalje radimo u istoj ulici, sa istim \u017earom, sa istom ma\u0161inom i sa puno ve\u0107im snovima.',
        'Svaka narud\u017eba po\u010dinje razgovorom. Upoznavaju\u0107i stil klijenta, zajedni\u010dkim snagama pronalazimo idealan modni dodatak koji je isklju\u010divo napravljen prema \u017eeljama klijenta.',
        'Me\u0111utim, u nazivima na\u0161ih modela se krije posebno zna\u010denje. Svaki modni dodatak nosi ime sa zna\u010denjem koji idealno opisuje karakter osobe koja ga nosi.',

      ],
      highlightsTitle: '\u0160ta nas vodi',
      highlights: [
        {
          title: 'Zanat, ne proizvodnja',
          description:
            'Svaki rez, \u0161av, konac i pakovanje, isklju\u010divo nastaje u na\u0161oj radionici kako bi li\u010dno mi ispratili izradu od po\u010detka do kraja.',
        },
        {
          title: 'Prirodni materijali',
          description:
            'Sara\u0111ujemo samo sa lokalnim ko\u017earima koji dijele na\u0161e standarde odr\u017eivosti, transparentnosti i po\u0161tovanja prema zanatu.',
        },
        {
          title: 'Komadi koji stare uz tebe',
          description:
            'Boa komadi su napravljeni da skupljaju pri\u010de, a ne da se tro\u0161e. Patina i mogu\u0107nost restauracije va\u017eniji su nam od sezonskih trendova.',
        },
      ],
      processTitle: 'Kako nastaje tvoja narud\u017eba',
      processSteps: [
        'Konsultacije i skice - zajedno crtamo siluetu i biramo okove ili jednostavno pronalazimo najbolje rje\u0161enje iz na\u0161ih standardnih modela.',
        'Selekcija i priprema \u2013 Rezervi\u0161emo odgovaraju\u0107u ko\u017eu, provjeravamo vlakna i ton, zatim ru\u010dno krojimo i profiliramo svaki dio.',
        'Zavr\u0161na obrada. Kontrola prije isporuke, pakovanje u posebne kutije, sa posebnim detaljima i slanje na\u0161im klijentima.',
      ],
      timelineTitle: 'Dugoro\u010dni cilj brenda:',
      timelinePoints: [
        'Radionice u Travniku za sve koji \u017eele nau\u010diti ru\u010dno \u0161ivenje i njegu ko\u017ee.',
        'Saradnje s bh. kreativcima na limitiranim kapsulama i istra\u017eiva\u010dkim serijama.',
        'Program restauracije kako bi Boa komadi dobili novi sjaj i nakon godina no\u0161enja.',
      ],
      contactTitle: 'Spreman/spremna za svoju Boa Belts pri\u010du?',
      contactSubtitle:
        'Narud\u017ebu mo\u017ee\u0161 izvr\u0161iti porukom na Instagramu, Facebooku ili e-mailom\u2014odgovaramo u roku od 24 sata.',
      contactMethods: {
        instagram: {
          label: 'Instagram poruka',
          href: 'https://www.instagram.com/boa_belts/?hl=en',
          description: 'Po\u0161alji DM s idejom, mjerama ili fotografijama za inspiraciju.',
        },
        facebook: {
          label: 'Facebook Messenger',
          href: 'https://www.facebook.com/profile.php?id=100027303537151',
          description: 'Pi\u0161i nam na bosanskom ili engleskom i dogovori narud\u017ebu u realnom vremenu.',
        },
        email: {
          label: 'Email',
          value: 'beltsboa@gmail.com',
          description: 'Za detaljne brifove po\u0161alji poruku s rokovima i referencama.',
        },
      },
      channelsTitle: 'Pridru\u017ei se na\u0161im kanalima',
      channelsSubtitle:
        'Budi prvi koji \u0107e vidjeti nove modele, rezervirati limitirane serije i dobiti pogled iza kulisa.',
      channels: [
        {
          label: 'Instagram broadcast kanal',
          href: 'https://www.instagram.com/channel/AbZM4SjaMTlKZFSE/',
        },
        {
          label: 'Viber zajednica',
          href: 'https://invite.viber.com/?g2=AQAaoTnRFh7cx1QzWYBXSwkl19bz2fm%2F3SY8bj9neDsJbnIxB09dthrxxJj0pl5z',
        },
      ],
      ctaTitle: 'Posjetite nas ili nam pi\u0161ite',
      ctaText:
        'Termine rezervi\u0161emo za probe, izbor ko\u017ee i konsultacije o dizajnu. Radujemo se novim idejama i pri\u010dama.',
      ctaButton: 'Zaka\u017ei posjetu studiju',
    },
  },
} as const;

type Translations = typeof translations;
export type Translation = Translations['bs'];

type LanguageContextValue = {
  t: Translation;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const value = useMemo(
    () => ({
      t: translations.bs,
    }),
    [],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

export default LanguageProvider;










