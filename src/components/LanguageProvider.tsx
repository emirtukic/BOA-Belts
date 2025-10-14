'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type Language = 'en' | 'bs';

const translations = {
  en: {
    nav: {
      home: 'Home',
      belts: 'Belts',
      bags: 'Bags',
      wallets: 'Wallets',
      about: 'About',
      contact: 'Contact',
      contactCta: "Let's Talk",
      languageToggle: 'BS',
      languageToggleAria: 'Switch to Bosnian',
      follow: 'Follow us',
    },
    hero: {
      title: 'Handcrafted Leather Goods from Travnik',
      subtitle:
        'Boa Belts is a boutique leather studio shaping belts, bags, and wallets by hand with Bosnian craftsmanship and premium European hides.',
      cta: 'Explore Belts',
    },
    about: {
      title: 'Crafted in Travnik, Bosnia and Herzegovina',
      body:
        'Boa Belts blends traditional leatherworking skills with modern design to create durable pieces that age beautifully. Each item is cut, stitched, and finished in Travnik, ensuring character-rich products made for everyday wear and lifelong use.',
      ctaLabel: 'Read our story',
    },
    belts: {
      title: 'Signature Belts',
      cards: [
        {
          title: 'Handcrafted Finish',
          description:
            'Every belt is cut, burnished, and stitched by hand for a rich patina and enduring strength.',
        },
        {
          title: 'Made to Measure',
          description:
            'Custom sizing and hole spacing tailored to your wardrobe, from everyday denim to tailored suits.',
        },
        {
          title: 'Premium Leather',
          description:
            'Full-grain, vegetable-tanned hides sourced from trusted European tanneries for a supple feel and depth of colour.',
        },
        {
          title: 'Statement Hardware',
          description:
            'Solid brass and stainless-steel buckles selected for their weight, character, and long-lasting shine.',
        },
      ],
      ctaLabel: 'Discover all belts',
    },
    bags: {
      title: 'Leather Bags for Every Day',
      cards: [
        {
          title: 'Carry-All Totes',
          description:
            'Roomy tote bags with reinforced handles and structured bases ready for busy city days or market runs.',
        },
        {
          title: 'Crossbody Essentials',
          description:
            'Slim crossbody silhouettes that keep your hands free while our precise stitching and interior pockets keep essentials organised.',
        },
        {
          title: 'Travel-Ready Packs',
          description:
            'Weekenders and backpacks lined with resilient cotton, made to handle weekend escapes and the daily commute.',
        },
      ],
      ctaLabel: 'See the bag lineup',
    },
    wallets: {
      title: 'Wallets & Accessories crafted to last.',
      cta: 'Request a Custom Wallet',
      cards: [
        {
          title: 'Slim Profiles',
          description: 'Minimalist card holders that slide neatly into any pocket without bulk.',
        },
        {
          title: 'Secure Stitching',
          description: 'Saddle-stitched seams resist daily wear and keep edges tight for years.',
        },
        {
          title: 'Thoughtful Interiors',
          description: 'Organised compartments tailored to your cards, cash, and small essentials.',
        },
      ],
      ctaLabel: 'Browse wallets and accessories',
    },
    contactSection: {
      title: 'Tell us what to craft next',
      description:
        'Complete the form and the Boa Belts team will help you choose the right piece or plan a custom order.',
      form: {
        firstName: 'First name*',
        lastName: 'Last name*',
        phoneNumber: 'Phone number',
        preferredProduct: 'Preferred product',
        email: 'Email*',
        interest: 'What are you interested in?*',
        selectPlaceholder: '-- Please choose an option --',
        options: {
          belt: 'Signature belt',
          bag: 'Leather bag',
          wallet: 'Wallet or cardholder',
        },
        messageLabel: 'Tell us about your idea*',
        submit: 'Send Request',
      },
    },
    followLinks: {
      instagram: 'Instagram',
      facebook: 'Facebook',
    },
    footer: {
      description:
        'Handcrafted leather belts, bags, and wallets made in Travnik with full-grain hides and time-honoured techniques.',
      navigationTitle: 'Categories',
      navigationTitle2: 'About us',
      contactTitle: 'Contact',
      followTitle: 'Follow us',
      location: 'Travnik, Bosnia and Herzegovina',
      instagramLabel: 'Instagram @boa.belts.ba',
      facebookLabel: 'Facebook /boa.belts.ba',
      copyright: 'Boa Belts. All rights reserved.',
    },
    beltsPage: {
      heroTitle: 'Signature Belts Crafted in Travnik',
      heroSubtitle:
        'From casual denim to tailored suits, our belts are built to carry your story with a patina that gets deeper every season.',
      heroCta: 'Request a custom belt',
      craftsmanshipTitle: 'Craftsmanship that ages beautifully',
      craftsmanshipParagraphs: [
        'We select full-grain, vegetable-tanned hides from trusted European tanneries to ensure each strap begins with the richest possible texture.',
        'Edges are bevelled, burnished, and waxed by hand before we saddle-stitch every seam for strength you can feel.',
      ],
      highlightTitle: 'What makes our belts different',
      highlightItems: [
        {
          title: 'Full-grain leather',
          description: 'Supple, character-rich hides that develop a deep patina rather than cracking or peeling.',
        },
        {
          title: 'Solid hardware',
          description: 'Brass, copper, and stainless-steel buckles chosen for their weight, finish, and longevity.',
        },
        {
          title: 'Made-to-measure',
          description: 'Hole spacing, strap width, and silhouette tailored to your wardrobe, whether jeans or dress trousers.',
        },
      ],
      sizingTitle: 'Sizing guidance',
      sizingText: 'We cut every strap to your preferred fit. Choose the approach that suits you best:',
      sizingPoints: [
        'Provide waist and hip measurements for multi-position belts.',
        'Send your favourite belt and we will match the fit precisely.',
        'Book a short call so we can guide you through the measuring process.',
      ],
      careTitle: 'Care tips',
      careSteps: [
        'Brush away dust with a soft cloth after each wear.',
        'Condition the leather twice a year with neutral balm.',
        'Store belts rolled loosely to preserve shape and avoid creasing.',
      ],
      closingTitle: 'Ready for your next belt?',
      closingText:
        'Share your measurements or wardrobe plans and we will sketch a strap that fits both your style and daily routine.',
      closingButton: 'Plan a belt with us',
    },
    bagsPage: {
      heroTitle: 'Leather bags built to travel with you',
      heroSubtitle:
        'Structured totes, compact crossbodies, and weekend packs made to carry the stories of Sarajevo streets and journeys abroad.',
      heroCta: 'Start a bag enquiry',
      craftsmanshipTitle: 'Designed for daily use',
      craftsmanshipParagraphs: [
        'We reinforce load-bearing points with hidden rivets and double stitching so your bag stays reliable for years.',
        'Natural cotton and suede linings protect laptops, notebooks, and everyday essentials without adding extra bulk.',
      ],
      highlightTitle: 'Collections',
      highlightItems: [
        {
          title: 'Travnik Totes',
          description: 'Structured profiles with reinforced handles that stand upright beside your desk or seat.',
        },
        {
          title: 'Ferhadija Crossbodies',
          description: 'Slim silhouettes with interior dividers and adjustable straps for hands-free city days.',
        },
        {
          title: 'Vla\u0161i\u0107 Weekenders',
          description: 'Roomy packs lined with waxed canvas and dedicated pockets for shoes and travel documents.',
        },
      ],
      materialsTitle: 'Material palette',
      materialsList: [
        'Full-grain Italian bovine leather in natural, chestnut, and midnight tones.',
        'Antique brass hardware developed to match the warm patina of our straps.',
        'Optional shearling or felt padding for laptop compartments and cameras.',
      ],
      closingTitle: 'Carry a bag that fits your rhythm',
      closingText:
        'Describe your daily routine or upcoming trip and we will recommend silhouettes, colours, and interior layouts tailored to you.',
      closingButton: 'Design a bag together',
    },
    walletsPage: {
      heroTitle: 'Wallets and accessories that stay with you',
      heroSubtitle:
        'Compact designs for cards, cash, and keepsakes—stitched by hand so they remain slim yet enduring.',
      heroCta: 'Request a wallet mock-up',
      signatureTitle: 'Signature builds',
      signatureItems: [
        {
          title: 'Classic bifold',
          description: 'Four card slots, a bills compartment, and optional coin pouch for international travel.',
        },
        {
          title: 'Minimal card sleeve',
          description: 'Two outer pockets and a centre slip that moulds to your essentials within a few wears.',
        },
        {
          title: 'Travel folio',
          description: 'Holds passport, boarding passes, and currencies with a secure wrap-around strap.',
        },
      ],
      customisationTitle: 'Customisation options',
      customisationList: [
        'Edge paint or natural burnish in complementary tones.',
        'Monogram embossing or laser engraving on interior panels.',
        'Contrasting saddle-stitch colours to match your existing accessories.',
      ],
      careTitle: 'Care in three steps',
      careSteps: [
        'Keep the wallet away from direct moisture; pat dry if exposed to rain.',
        'Use a small amount of neutral cream every six months.',
        'Rotate cards occasionally to ensure even wear across pockets.',
      ],
      closingTitle: 'Let us tailor your everyday carry',
      closingText:
        'Tell us how many cards you carry, the currencies you use, and any special keepsakes—our team will draft a layout just for you.',
      closingButton: 'Start a wallet order',
    },
    aboutPage: {
      heroTitle: 'About Boa Belts',
      heroSubtitle: 'A Travnik workshop dedicated to slow craftsmanship, honest materials, and lasting relationships.',
      storyTitle: 'Our story',
      storyParagraphs: [
        'Boa Belts began in a small Travnik studio with a single stitching pony and a belief that everyday objects deserve the same care as heirlooms.',
        'Today we serve clients across Bosnia and Herzegovina and beyond, keeping production local while sourcing the best European hides and hardware.',
      ],
      valuesTitle: 'What we stand for',
      values: [
        {
          title: 'Handmade in Travnik',
          description: 'Every belt, bag, and wallet is cut, stitched, and finished in-house for complete quality control.',
        },
        {
          title: 'Transparent sourcing',
          description: 'We only work with tanneries and partners who meet our standards for traceability and responsible production.',
        },
        {
          title: 'Pieces built to last',
          description: 'Our goal is to create goods that accompany you for decades, not seasons.',
        },
      ],
      craftTitle: 'Tools, hides, and patience',
      craftParagraphs: [
        'From French skiving knives to pricking irons tuned for perfect stitch spacing, our workshop is set up for precision work.',
        'We test every new hide for elasticity, aroma, and finish, ensuring it complements the intended product before it reaches your hands.',
      ],
      timelineTitle: 'Milestones',
      timelinePoints: [
        '2018 – First bespoke belts delivered to clients in Travnik and Sarajevo.',
        '2020 – Expanded into small-run bag production and introduced custom wallet programme.',
        '2024 – Opened our appointment-only studio for fittings, workshops, and collaborations.',
      ],
      ctaTitle: 'Visit the workshop or write to us',
      ctaText:
        'Appointments are available for fittings, leather selection, and design consultations. We are always ready to explore new ideas with you.',
      ctaButton: 'Book a studio visit',
    },
  },
  bs: {
    nav: {
      home: 'Po\u010detna',
      belts: 'Kai\u0161evi',
      bags: 'Torbe',
      wallets: 'Nov\u010danici',
      about: 'O nama',
      contact: 'Kontakt',
      contactCta: 'Kontaktiraj nas',
      languageToggle: 'EN',
      languageToggleAria: 'Prebaci na engleski',
      follow: 'Pratite nas',
    },
    hero: {
      title: 'Ru\u010dno ra\u0111eni ko\u017eni proizvodi iz Travnika',
      subtitle:
        'Boa Belts je butik ko\u017earski studio koji ru\u010dno izra\u0111uje kai\u0161eve, torbe i nov\u010danike bosanskim zanatskim vje\u0161tinama i vrhunskim evropskim ko\u017eama.',
      cta: 'Istra\u017ei kai\u0161eve',
    },
    about: {
      title: 'Izra\u0111eno u Travniku, Bosna i Hercegovina',
      body:
        'Boa Belts spaja tradicionalne ko\u017earske vje\u0161tine s modernim dizajnom kako bi stvorio izdr\u017eljive komade koji s vremenom postaju jo\u0161 ljep\u0161i. Svaki proizvod se re\u017ee, \u0161ije i zavr\u0161ava u Travniku, pa nastaju predmeti puni karaktera spremni za svakodnevnu upotrebu.',
      ctaLabel: 'Saznaj vi\u0161e o nama',
    },
    belts: {
      title: 'Potpisni kai\u0161evi',
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
      ctaLabel: 'Pogledaj cijelu kolekciju kai\u0161eva',
    },
    bags: {
      title: 'Ko\u017ene torbe za svaki dan',
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
      ctaLabel: 'Pogledaj kolekciju torbi',
    },
    wallets: {
      title: 'Nov\u010danici i dodaci napravljeni da traju.',
      cta: 'Zatra\u017ei prilago\u0111eni nov\u010danik',
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
        'Ru\u010dno ra\u0111eni kai\u0161evi, torbe i nov\u010danici iz Travnika izra\u0111eni od punog zrna ko\u017ee tradicionalnim tehnikama.',
      navigationTitle: 'Kategorije',
      navigationTitle1: 'O nama',
      contactTitle: 'Kontakt',
      followTitle: 'Pratite nas',
      location: 'Travnik, Bosna i Hercegovina',
      copyright: 'Boa Belts. Sva prava zadr\u017eana.',
    },
    beltsPage: {
      heroTitle: 'Potpisni kai\u0161evi iz Travnika',
      heroSubtitle:
        'Od farmerki do odijela, na\u0161i kai\u0161evi prate svaku kombinaciju i starenjem dobijaju na ljepoti.',
      heroCta: 'Zatra\u017ei kai\u0161 po mjeri',
      craftsmanshipTitle: 'Zanat koji traje',
      craftsmanshipParagraphs: [
        'Biramo ko\u017eu punog zrna iz provjerenih evropskih \u0161tavionica kako bismo dobili najbogatiju teksturu.',
        'Rubovi se ru\u010dno oblikuju, poliraju i voskiraju prije nego \u0161to svaki \u0161av ru\u010dno pro\u0161ijemo saddle tehnikom.',
      ],
      highlightTitle: 'Za\u0161to su na\u0161i kai\u0161evi posebni',
      highlightItems: [
        {
          title: 'Ko\u017ea punog zrna',
          description: 'Meko\u0107a i karakter koji razvijaju patinu umjesto pucanja ili lju\u0161tenja.',
        },
        {
          title: 'Masivna kop\u010da',
          description: 'Mesingane, bakarne i \u010deli\u010dne kop\u010de birane zbog te\u017eine, zavr\u0161ne obrade i dugotrajnosti.',
        },
        {
          title: 'Izrada po mjeri',
          description: 'Raspored rupica, \u0161irina i silueta prilago\u0111eni va\u0161oj garderobi.',
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
      closingTitle: 'Spremni za novi kai\u0161?',
      closingText:
        'Po\u0161aljite nam mjere ili stil koji preferirate, a mi \u0107emo predlo\u017eiti kai\u0161 koji prati va\u0161 ritam.',
      closingButton: 'Planiraj kai\u0161 s nama',
    },
    bagsPage: {
      heroTitle: 'Ko\u017ene torbe koje putuju s vama',
      heroSubtitle:
        'Strukturirane tote torbe, kompaktne crossbody torbice i vikend torbe spremne za grad i putovanja.',
      heroCta: 'Zapo\u010dni upit za torbu',
      craftsmanshipTitle: 'Dizajnirane za svakodnevicu',
      craftsmanshipParagraphs: [
        'Oja\u010davamo kriti\u010dne ta\u010dke skrivenim nitnama i duplim \u0161avovima kako bi torba bila pouzdana godinama.',
        'Prirodne pamu\u010dne i antilop postave \u0161tite laptop, bilje\u017enice i sve sitnice, bez dodatne te\u017eine.',
      ],
      highlightTitle: 'Na\u0161e linije torbi',
      highlightItems: [
        {
          title: 'Travnik tote',
          description: 'Strukturirane forme sa oja\u010danim ru\u010dkama koje stoje uspravno pored stola.',
        },
        {
          title: 'Ferhadija crossbody',
          description: 'Vitke siluete s unutra\u0161njim pregradama i podesivim kai\u0161em za slobodne ruke.',
        },
        {
          title: 'Vla\u0161i\u0107 weekend',
          description: 'Prostrane torbe sa vo\u0161tanom postavom i posebnim d\u017eepovima za obu\u0107u i dokumente.',
        },
      ],
      materialsTitle: 'Materijali',
      materialsList: [
        'Ko\u017ea punog zrna u prirodnim, kesten i tamnim tonovima.',
        'Antikni mesing koji prate topli sjaj na\u0161ih kai\u0161eva.',
        'Opciona podstava od filca ili umjetnog krzna za tehniku ili foto opremu.',
      ],
      closingTitle: 'Torba koja prati tvoj ritam',
      closingText:
        'Opi\u0161ite svoje dnevne navike ili planirani put, a mi \u0107emo predlo\u017eiti formu, boju i unutra\u0161nji raspored.',
      closingButton: 'Kreiraj torbu zajedno s nama',
    },
    walletsPage: {
      heroTitle: 'Nov\u010danici i dodaci uz koje trajete',
      heroSubtitle:
        'Kompaktni dizajni za kartice, gotovinu i uspomene—ru\u010dno \u0161iveni kako bi ostali tanki i izdr\u017eljivi.',
      heroCta: 'Zatra\u017ei skicu nov\u010danika',
      signatureTitle: 'Potpisni modeli',
      signatureItems: [
        {
          title: 'Klasi\u010dni preklopni nov\u010danik',
          description: '\u010cetiri odjeljka za kartice, prostor za novac i opcioni d\u017eep za sitni\u0161.',
        },
        {
          title: 'Minimal futrola',
          description: 'Dvije vanjske pregrade i sredi\u0161nji d\u017eep koji se ve\u0107 nakon nekoliko no\u0161enja oblikuje po vama.',
        },
        {
          title: 'Putni folio',
          description: '\u010cuva paso\u0161, karte i valute uz sigurnu traku koja se omotava oko cijelog dodatka.',
        },
      ],
      customisationTitle: 'Opcije prilago\u0111avanja',
      customisationList: [
        'Ru\u010dni burni\u0161 ili boja ruba u nijansi koja odgovara va\u0161em stilu.',
        'Utiskivanje inicijala ili lasersko graviranje na unutra\u0161njim panelima.',
        'Kontrastni saddle \u0161av u boji koja prati va\u0161 postoje\u0107i pribor.',
      ],
      careTitle: 'Njega u tri koraka',
      careSteps: [
        'Za\u0161titite nov\u010danik od vlage; ako pokisne, nje\u017eno ga osu\u0161ite.',
        'Svakih \u0161est mjeseci nanesite malu koli\u010dinu neutralne kreme.',
        'Povremeno zamijenite raspored kartica kako bi se pritisak ravnomjerno rasporedio.',
      ],
      closingTitle: 'Prilagodimo va\u0161 svakodnevni pribor',
      closingText:
        'Napi\u0161ite koliko kartica nosite, u kojim valutama pla\u0107ate i da li imate posebne uspomene—predlo\u017eit \u0107emo raspored koji vam savr\u0161eno odgovara.',
      closingButton: 'Pokreni narud\u017ebu nov\u010danika',
    },
    aboutPage: {
      heroTitle: 'O nama',
      heroSubtitle: 'Travni\u010dki atelje posve\u0107en sporoj izradi, \u010distim materijalima i trajnim odnosima.',
      storyTitle: 'Na\u0161a pri\u010da',
      storyParagraphs: [
        'Boa Belts je nastao u malom travni\u010dkom studiju iz \u017eelje da svakodnevni predmeti dobiju pa\u017enju vrijednu porodi\u010dnih naslje\u0111a.',
        'Danas radimo s klijentima \u0161irom Bosne i Hercegovine i inostranstva, zadr\u017eavaju\u0107i proizvodnju lokalnom dok biramo najbolje evropske ko\u017ee i okove.',
      ],
      valuesTitle: '\u0160ta nas vodi',
      values: [
        {
          title: 'Ru\u010dno ra\u0111eno u Travniku',
          description: 'Svaki kai\u0161, torba i nov\u010danik nastaje u na\u0161em studiju kako bismo imali potpunu kontrolu kvaliteta.',
        },
        {
          title: 'Transparentno porijeklo',
          description: 'Sara\u0111ujemo samo s partnerima koji zadovoljavaju na\u0161e standarde trasabilnosti i odgovorne proizvodnje.',
        },
        {
          title: 'Trajnost bez kompromisa',
          description: 'Na\u0161 cilj je da va\u0161i komadi traju godinama, a ne sezonama.',
        },
      ],
      craftTitle: 'Alati, ko\u017ee i strpljenje',
      craftParagraphs: [
        'Od francuskih no\u017eeva za skidanje do igala za savr\u0161eni razmak \u0161avova—na\u0161a radionica je pode\u0161ena za precizan rad.',
        'Svaku novu ko\u017eu testiramo na elasti\u010dnost, miris i zavr\u0161nu obradu prije nego \u0161to u\u0111e u va\u0161u narud\u017ebu.',
      ],
      timelineTitle: 'Milestone trenuci',
      timelinePoints: [
        '2018 – Prvi kai\u0161evi po mjeri isporu\u010deni klijentima u Travniku i Sarajevu.',
        '2020 – Pro\u0161irenje na limitirane serije torbi i uvo\u0111enje programa prilago\u0111enih nov\u010danika.',
        '2024 – Otvoren studio po zakazivanju za probe, radionice i saradnje.',
      ],
      ctaTitle: 'Posjetite nas ili nam pi\u0161ite',
      ctaText:
        'Termine rezervi\u0161emo za probe, izbor ko\u017ee i konsultacije o dizajnu. Radujemo se novim idejama i pri\u010dama.',
      ctaButton: 'Zaka\u017ei posjetu studiju',
    },
  },
} as const;

type Translations = typeof translations;
type Translation = Translations[Language];

type LanguageContextValue = {
  language: Language;
  setLanguage: (value: Language) => void;
  toggleLanguage: () => void;
  t: Translation;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('bs');

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'bs' : 'en'));
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: translations[language],
    }),
    [language],
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
