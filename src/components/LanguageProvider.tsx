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
      accessories: 'Accessories',
      about: 'About',
      loyalty: 'Loyalty',
      contact: 'Contact',
      contactCta: "Let's Talk",
      languageToggle: 'BS',
      languageToggleAria: 'Switch to Bosnian',
      follow: 'Follow us',
    },
    search: {
      openLabel: 'Open search',
      modalLabel: 'Search products',
      placeholder: 'Search belts, bags, wallets\u2026',
      inputLabel: 'Search products',
      closeLabel: 'Close search',
      noResults: 'No results for',
      noImage: 'No image',
      backToHome: 'Back to homepage',
      categoryLabels: {
        womensBelts: "Women's belt",
        mensBelts: "Men's belt",
        bags: 'Bag',
        wallets: 'Wallet',
        accessories: 'Accessory',
      },
    },
    hero: {
      title: 'The First Bosnian Leather Accessories Brand',
      subtitle:
        'Handmade in Travnik: belts, bags, and wallets in full-grain leather\u2014where craft meets style.',
      cta: 'Explore the collection',
    },
    home: {
      mobileTilesButton: 'View all',
    },
    gallery: {
      title: 'Inside the Boa studio',
      subtitle:
        'Scroll sideways to explore textures, tools, and finished pieces captured during our latest builds.',
      items: [
        {
          title: 'Hand-burnished belt edges',
          description: 'Every edge is sealed and polished for a glass-smooth finish that resists wear.',
        },
        {
          title: 'Cutting straps to measure',
          description: 'Precision head knives keep every strap straight before the first stitch is added.',
        },
        {
          title: 'Hardware selection',
          description: 'Solid brass buckles and clasps are matched to the tone and weight of each hide.',
        },
        {
          title: 'Stitching saddle seams',
          description: 'Saddle-stitched seams lock threads in place, even under daily tension.',
        },
        {
          title: 'Finished belt lineup',
          description: 'A look at recently delivered belts waiting for final inspection and packaging.',
        },
      ],
      controls: {
        previous: 'Scroll gallery backwards',
        next: 'Scroll gallery forwards',
      },
    },
    about: {
      title: 'Crafted in Travnik, Bosnia and Herzegovina',
      body:
        'Boa Belts blends traditional leatherworking skills with modern design to create durable pieces that age beautifully. Each item is cut, stitched, and finished in Travnik, ensuring character-rich products made for everyday wear and lifelong use.',
      ctaLabel: 'Read our story',
    },
    belts: {
      title: 'Belts That Elevate Every Look',
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
      ctaLabel: 'View the collection',
    },
    bags: {
      title: 'Bags That Tell Your Story',
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
      ctaLabel: 'Choose your bag',
    },
    wallets: {
      title: 'Wallets for a Minimalist Style',
      cta: 'Learn more',
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
        'Prvi bosanskohercegovacki brend rucno radjenih, koznih kaiseva,',
      navigationTitle: 'Categories',
      navigationTitle1: 'About us',
      contactTitle: 'Contact',
      followTitle: 'Follow us',
      location: 'Travnik, Bosnia and Herzegovina',
      instagramLabel: 'Instagram @boa_belts',
      facebookLabel: 'Facebook Boa Belts',
      copyright: 'Boa Belts. All rights reserved.',
    },
    loyalty: {
      badge: 'Loyalty Card',
      title: 'Meet the Boa Loyalty Card',
      subtitle: 'Every purchase moves you closer to richer rewards and thoughtful surprises.',
      perks: [
        'You receive your loyalty card with your very first enquiry and order.',
        '3rd order: 15% off your custom build.',
        '6th order: surprise gift tailored to your style.',
        '9th order: 25% off.',
        '12th order: surprise gift delivered with your piece.',
        '15th order: 50% off.',
        '18th order: surprise experience from the studio.',
      ],
      note: 'The loyalty card is active from today and remains valid indefinitely. There is no minimum spend required.',
      cta: 'Explore loyalty perks',
    },
    beltsPage: {
      heroTitle: 'Belts That Elevate Every Look',
      heroSubtitle:
        'Handcrafted from premium leather and proudly presenting Bosnia and Herzegovina\'s first specialist belt brand. Style that endures.',
      heroCta: 'View the collection',
      craftsmanshipTitle: 'Belts \u2013 Style that Lasts',
      craftsmanshipParagraphs: [
        'Our belts are not just an accessory\u2014they anchor your look. From casual denim to tailored suits, they follow your style and gain character with every season.',
      ],
      highlightTitle: 'Signature belt details',
      highlightItems: [
        {
          title: 'Premium full-grain leather',
          description: 'Sourced from trusted European tanneries for depth of colour, strength, and longevity.',
        },
        {
          title: 'Hand-burnished edges',
          description: 'Each strap is cut by hand and finished with a smooth burnish for a refined feel.',
        },
        {
          title: 'Solid hardware',
          description: 'Weighted brass and steel buckles that mirror the quality of the leather.',
        },
        {
          title: 'Made to measure',
          description: 'Length and hole spacing tailored to the outfits you wear most.',
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
      closingTitle: 'Choose a belt that leads the look',
      closingText:
        'Choose a belt that doesn\'t fade into the background\u2014it tells your story.',
      closingButton: 'Start your belt enquiry',
      categoryMenu: {
        womens: "Women's",
        mens: "Men's",
      },
      sections: {
        womens: {
          title: "Women's Belts",
          subtitle: 'Bespoke silhouettes tailored for women.',
        },
        mens: {
          title: "Men's Belts",
          subtitle: 'Rugged builds crafted for men.',
        },
        stylesLabel: 'styles',
      },
      card: {
        availabilityLabel: 'Dostupno u vise boja',
        craftedBadge: 'Handcrafted',
        selectColorLabel: 'Select {color} for {product}',
        infoAriaLabel: 'View description for {product}',
        variantLabel: '{variant} option',
        closeLabel: 'Close',
        closeAria: 'Close description',
      },
      sort: {
        label: 'Sort',
        options: {
          asc: 'Lowest price first',
          desc: 'Highest price first',
        },
      },
    },
    bagsPage: {
      heroTitle: 'Bags That Tell Your Story',
      heroSubtitle:
        'Made for the city, the journey, and every day\u2014premium materials, refined design, crafted with care.',
      heroCta: 'Choose your bag',
      craftsmanshipTitle: 'Bags that move with your rhythm',
      craftsmanshipParagraphs: [
        'Our collection is shaped for city days, travel, and everyday transitions. Whether you need the structure of a work tote, a crossbody for exploring, or a weekender for quick escapes, it\'s here.',
      ],
      highlightTitle: 'Designed to carry more than essentials',
      highlightItems: [
        {
          title: 'Premium materials',
          description: 'Leather with a story and resilient textiles that handle daily use.',
        },
        {
          title: 'Considered details',
          description: 'Reinforced handles, grounded bases, and neat stitching keep every carry secure.',
        },
        {
          title: 'Balanced design',
          description: 'Function and aesthetics in equal measure for whatever the day brings.',
        },
      ],
      materialsTitle: 'Material palette',
      materialsList: [
        'Full-grain Italian bovine leather in natural, chestnut, and midnight tones.',
        'Antique brass hardware developed to match the warm patina of our straps.',
        'Optional shearling or felt padding for laptop compartments and cameras.',
      ],
      collectionTitle: 'Leather Bag Collection',
      collectionSubtitle:
        'Twenty handcrafted totes, crossbodies, backpacks, and weekenders presented in one unified catalogue.',
      stylesLabel: 'designs',
      categoryMenu: {
        daily: 'Daily Carry',
        travel: 'Travel Ready',
      },
      sections: {
        daily: {
          title: 'Daily Carry Bags',
          subtitle: 'Ten designs tuned for workdays, cafe meetups, and evening outings.',
        },
        travel: {
          title: 'Travel & Weekender Bags',
          subtitle: 'Ten roomy builds prepared for airports, road trips, and gear.',
        },
        stylesLabel: 'designs',
      },
      card: {
        availabilityLabel: 'Dostupno u vise boja',
        craftedBadge: 'Handcrafted',
        selectColorLabel: 'Select {color} for {product}',
        infoAriaLabel: 'View description for {product}',
        variantLabel: '{variant} option',
        closeLabel: 'Close',
        closeAria: 'Close description',
      },
      sort: {
        label: 'Sort',
        options: {
          asc: 'Lowest price first',
          desc: 'Highest price first',
        },
      },
      closingTitle: 'Carry your style',
      closingText:
        'Choose a bag that carries more than essentials\u2014it carries your style.',
      closingButton: 'Plan your bag with us',
    },
    walletsPage: {
      heroTitle: 'Wallets for a Minimalist Style',
      heroSubtitle:
        'Compact, elegant, and long-lasting\u2014a blend of functionality and artisanal finishing for those who know what they want.',
      heroCta: 'Learn more',
      signatureTitle: 'Wallets \u2013 Minimal profile, maximum endurance',
      signatureItems: [
        {
          title: 'Saddle-stitched seams',
          description: 'Hand-sewn construction that keeps its form even after years of daily use.',
        },
        {
          title: 'Refined materials',
          description: 'Premium leather inside and out for durability, structure, and a polished feel.',
        },
        {
          title: 'Minimalist layouts',
          description: 'Slim profiles that still organise cards, cash, and keepsakes.',
        },
      ],
      customisationTitle: 'Customisation options',
      customisationList: [
        'Edge paint or natural burnish in complementary tones.',
        'Monogram embossing or laser engraving on interior panels.',
        'Contrasting saddle-stitch colours to match your existing accessories.',
      ],
      heroParagraphs: [
        'Space may be limited, but your style isn\'t. Our wallets stay slim while keeping cards, cash, and keepsakes exactly where you need them.',
        'Step into accessories that perform\u2014and look the part.',
      ],
      collectionTitle: 'Wallet & Accessory Collection',
      collectionSubtitle:
        'Twenty handcrafted card sleeves, folios, and organisers unified in a single showcase.',
      stylesLabel: 'layouts',
      careTitle: 'Care in three steps',
      careSteps: [
        'Keep the wallet away from direct moisture; pat dry if exposed to rain.',
        'Use a small amount of neutral cream every six months.',
        'Rotate cards occasionally to ensure even wear across pockets.',
      ],
      categoryMenu: {
        slim: 'Card Holders',
        carry: 'Organisers',
      },
      sections: {
        slim: {
          title: 'Card Holder Wallets',
          subtitle: 'Ten ultra-slim builds focused on cards and light cash.',
        },
        carry: {
          title: 'Carry-All Wallets',
          subtitle: 'Ten organisers sized for travel documents, phones, and notebooks.',
        },
        stylesLabel: 'layouts',
      },
      card: {
        availabilityLabel: 'Dostupno u vise boja',
        craftedBadge: 'Handcrafted',
        selectColorLabel: 'Select {color} for {product}',
        infoAriaLabel: 'View description for {product}',
        variantLabel: '{variant} option',
        closeLabel: 'Close',
        closeAria: 'Close description',
      },
      sort: {
        label: 'Sort',
        options: {
          asc: 'Lowest price first',
          desc: 'Highest price first',
        },
      },
      closingTitle: 'Keep it minimal',
      closingText:
        'Tell us what you carry and we\'ll shape a wallet that fits your routine without adding bulk.',
      closingButton: 'Start your wallet enquiry',
    },
    accessoriesPage: {
      heroTitle: 'Accessories',
      heroHeading: 'Leather Accessories Built to Last',
      heroSubtitle:
        'Wraps, bracelets, and cases crafted in Travnik to elevate daily rituals.',
      heroParagraphs: [
        'Each piece is cut, stitched, and finished from the same full-grain hides we use for our belts.',
        'Mix and match hues or pair them with gifts\u2014the patina deepens with every season.',
      ],
      collectionTitle: 'Accessories Collection',
      collectionSubtitle: 'Five handcrafted accessories ready for everyday use or gifting.',
      stylesLabel: 'pieces',
      card: {
        availabilityLabel: 'Dostupno u vise boja',
        craftedBadge: 'Handcrafted',
        selectColorLabel: 'Select {color} for {product}',
        infoAriaLabel: 'View description for {product}',
        variantLabel: '{variant} option',
        closeLabel: 'Close',
        closeAria: 'Close description',
      },
      sort: {
        label: 'Sort',
        options: {
          asc: 'Lowest price first',
          desc: 'Highest price first',
        },
      },
    },
    aboutPage: {
      heroTitle: 'Inside Boa Belts',
      heroSubtitle:
        'From a Travnik garage to wardrobes around the world\u2014handmade leather pieces, transparent sourcing, and clients who become friends.',
      introTitle: 'Why We Build Precise',
      introParagraphs: [
        'Boa Belts started with one stitching pony, a single hide, and a promise to treat everyday accessories like heirlooms. We still work on that same street in Travnik, shaping belts, bags, and wallets one order at a time.',
        'Every commission begins with a conversation. We pair vegetable-tanned European leather with traditional hand tools, documenting each step so you know exactly who made your piece and how.',
      ],
      highlightsTitle: 'What Guides Our Studio',
      highlights: [
        {
          title: 'Craft, Not Production',
          description:
            'We obsess over detail. Every cut, stitch, and burnish happens in-house so we can sign off on the finish personally.',
        },
        {
          title: 'Traceable Materials',
          description:
            'We collaborate only with tanneries and foundries that share our standards for sustainability, transparency, and respect for the craft.',
        },
        {
          title: 'Pieces Built to Age',
          description:
            'Boa goods are designed to gather stories\u2014not wear out. Patina, repairability, and long-term support matter more than fast seasons.',
        },
      ],
      processTitle: 'How Your Order Comes to Life',
      processSteps: [
        'Consult & Sketch \u2013 Tell us how you plan to use the piece and we outline the silhouette, hardware, and measurements.',
        'Select & Prepare \u2013 We reserve the perfect hide, inspect the grain and temper, then cut, bevel, and burnish each component by hand.',
        'Stitch & Finish \u2013 Saddle-stitching, edge sealing, conditioning, and a final inspection before your order leaves Travnik.',
      ],
      timelineTitle: 'Where We\'re Heading',
      timelinePoints: [
        'Community workshops in Travnik for clients eager to learn hand-stitching and leather care.',
        'Collaborations with Bosnian creatives on limited capsule drops and experimental builds.',
        'A restoration programme so your Boa pieces can be revived for the next decade of wear.',
      ],
      contactTitle: 'Ready for Your Own Boa Story?',
      contactSubtitle:
        'Place your order via Instagram, Facebook, or email\u2014we reply within 24 hours.',
      contactMethods: {
        instagram: {
          label: 'Instagram Direct',
          href: 'https://www.instagram.com/boa_belts/?hl=en',
          description: 'Send a DM with your idea, measurements, or inspiration photos.',
        },
        facebook: {
          label: 'Facebook Messenger',
          href: 'https://www.facebook.com/profile.php?id=100027303537151',
          description: 'Message us in Bosnian or English to plan your order in real time.',
        },
        email: {
          label: 'Email',
          value: 'beltsboa@gmail.com',
          description: 'Prefer detailed briefs? Drop us a note with timelines and references.',
        },
      },
      channelsTitle: 'Join Our Broadcast Channels',
      channelsSubtitle:
        'Be the first to see new builds, reserve limited releases, and peek behind the scenes.',
      channels: [
        {
          label: 'Instagram Broadcast Channel',
          href: 'https://www.instagram.com/channel/AbZM4SjaMTlKZFSE/',
        },
        {
          label: 'Viber Community',
          href: 'https://invite.viber.com/?g2=AQAaoTnRFh7cx1QzWYBXSwkl19bz2fm%2F3SY8bj9neDsJbnIxB09dthrxxJj0pl5z',
        },
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
      accessories: 'Dodaci',
      about: 'O nama',
      loyalty: 'Loyalty kartica',
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
        'Ru\u010dna izrada u Travniku: kai\u0161evi, torbe i nov\u010danici od punog zrna ko\u017ee \u2013 spoj zanata i stila.',
      cta: 'Istra\u017ei kolekciju',
    },
    home: {
      mobileTilesButton: 'Pogledaj sve',
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
        'Prvi bosanskohercegova\u010dki brend ru\u010dno ra\u0111enih ko\u017enih kai\u0161eva.',
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
      heroTitle: 'Kai\u0161evi koji podi\u017eu svaki izgled',
      heroSubtitle:
        'Ru\u010dna izrada od premium ko\u017ee i s ponosom predstavljamo prvi bosanskohercegova\u010dki brend specijaliziran za ko\u017ene kai\u0161eve. Stil koji traje.',
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
        availabilityLabel: 'Dostupno u vise boja',
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
        availabilityLabel: 'Dostupno u vise boja',
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
        availabilityLabel: 'Dostupno u vise boja',
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
        subtitle: 'Svaka narud\u017eba te vodi do ve\u0107ih pogodnosti i pa\u017eljivo biranih iznena\u0111enja.',
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
        'Omoti, narukvice i futrole ra\u0111ene u Travniku \u2013 mali detalji koji zaokru\u017euju pri\u010du.',
      heroParagraphs: [
        'Svaki dodatak izra\u0111ujemo od istih punozrnih ko\u017ea, uz istu ru\u010dnu obradu kao i na\u0161e kai\u0161eve.',
        'Kombinuj nijanse ili ih pokloni dragim ljudima \u2013 patina s vremenom postaje jedinstvena.',
      ],
      collectionTitle: 'Kolekcija dodataka',
      collectionSubtitle: 'Pet ru\u010dno izra\u0111enih dodataka spremnih za poklanjanje ili svakodnevnu upotrebu.',
      stylesLabel: 'komada',
      card: {
        availabilityLabel: 'Dostupno u vise boja',
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
      heroTitle: 'Boa Belts iznutra',
      heroSubtitle:
        'Od gara\u017ee u Travniku do ormara \u0161irom svijeta\u2014ru\u010dno ra\u0111eni komadi, \u010disto porijeklo i klijenti koji postaju prijatelji.',
      introTitle: 'Za\u0161to radimo precizno',
      introParagraphs: [
        'Boa Belts je nastao uz jednu \u0161iva\u0107u klupu, jednu ko\u017eu i ideju da svakodnevni predmeti zaslu\u017euju pa\u017enju kao porodi\u010dna naslije\u0111a. Danas i dalje radimo u istoj ulici u Travniku, izra\u0111uju\u0107i kai\u0161eve, torbe i nov\u010danike po narud\u017ebi.',
        'Svaka narud\u017eba po\u010dinje razgovorom. Uparujemo evropsku, povr\u0161inski \u0161tavljenu ko\u017eu s tradicionalnim alatima i bilje\u017eimo svaki korak kako biste znali ko je izradio va\u0161 komad i na koji na\u010din.',
      ],
      highlightsTitle: '\u0160ta nas vodi',
      highlights: [
        {
          title: 'Zanat, ne proizvodnja',
          description:
            'Radimo detaljno i precizno. Svaki rez, \u0161av i poliranje nastaje u na\u0161em studiju kako bismo li\u010dno potpisali zavr\u0161nicu.',
        },
        {
          title: 'Transparentni materijali',
          description:
            'Saradujemo samo s ko\u017earama i livnicama koje dijele na\u0161e standarde odr\u017eivosti, transparentnosti i po\u0161tovanja prema zanatu.',
        },
        {
          title: 'Komadi koji stare uz tebe',
          description:
            'Boa komadi su napravljeni da skupljaju pri\u010de, a ne da se tro\u0161e. Patina i mogu\u0107nost restauracije va\u017eniji su nam od sezonskih trendova.',
        },
      ],
      processTitle: 'Kako nastaje tvoja narud\u017eba',
      processSteps: [
        'Konsultacije i skice \u2013 Napi\u0161i nam kako \u0107e\u0161 nositi komad; zajedno crtamo siluetu i biramo okove.',
        'Selekcija i priprema \u2013 Rezervi\u0161emo odgovaraju\u0107u ko\u017eu, provjeravamo vlakna i ton, zatim ru\u010dno krojimo i profiliramo svaki dio.',
        '\u0160ivenje i zavr\u0161na obrada \u2013 Saddle \u0161av, obrada rubova, njegovanje i zavr\u0161na kontrola prije isporuke.',
      ],
      timelineTitle: 'Kuda idemo',
      timelinePoints: [
        'Radionice u Travniku za sve koji \u017eele nau\u010diti ru\u010dno \u0161ivenje i njegu ko\u017ee.',
        'Saradnje s bh. kreativcima na limitiranim kapsulama i istra\u017eiva\u010dkim serijama.',
        'Program restauracije kako bi Boa komadi dobili novi sjaj i nakon godina no\u0161enja.',
      ],
      contactTitle: 'Spreman/spremna za svoju Boa pri\u010du?',
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
export type Translation = Translations[Language];

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
    [language, toggleLanguage],
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










