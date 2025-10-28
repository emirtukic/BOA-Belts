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
      navigationTitle1: 'About us',
      contactTitle: 'Contact',
      followTitle: 'Follow us',
      location: 'Travnik, Bosnia and Herzegovina',
      instagramLabel: 'Instagram @boa.belts.ba',
      facebookLabel: 'Facebook /boa.belts.ba',
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
        materialSuffix: ' leather',
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
        materialSuffix: ' leather',
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
      closingTitle: 'Carry a bag that fits your rhythm',
      closingText:
        'Describe your daily routine or upcoming trip and we will recommend silhouettes, colours, and interior layouts tailored to you.',
      closingButton: 'Design a bag together',
    },
    walletsPage: {
      heroTitle: 'Wallets and accessories that stay with you',
      heroSubtitle:
        'Compact designs for cards, cash, and keepsakesâ€”stitched by hand so they remain slim yet enduring.',
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
      heroParagraphs: [
        'Compact leather goods built for longevity, with every panel cut, skived, and saddle-stitched by hand.',
        'Choose between slim sleeves for everyday carry or organisers that keep documents, devices, and currencies in order.',
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
        materialSuffix: ' leather',
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
      closingTitle: 'Let us tailor your everyday carry',
      closingText:
        'Tell us how many cards you carry, the currencies you use, and any special keepsakesâ€”our team will draft a layout just for you.',
      closingButton: 'Start a wallet order',
    },
    aboutPage: {
      heroTitle: 'Inside Boa Belts',
      heroSubtitle: 'From a Travnik garage to wardrobes around the world—handmade leather pieces, transparent sourcing, and clients who become friends.',
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
            'We prioritise on details, precise work. Each cut, stitch, and burnish happens in-house so we can sign off on the finish personally.',
        },
        {
          title: 'Traceable Materials',
          description:
            'We collaborate only with tanneries and foundries that share our standards for sustainability, transparency, and respect for the craft.',
        },
        {
          title: 'Pieces Built to Age',
          description:
            'Boa goods are designed to gather stories—not wear out. Patina, repairability, and long-term support matter more than fast seasons.',
        },
      ],
      processTitle: 'How Your Order Comes to Life',
      processSteps: [
        'Consult & Sketch – Tell us how you plan to use the piece and we outline the silhouette, hardware, and measurements.',
        'Select & Prepare – We reserve the perfect hide, inspect the grain and temper, then cut, bevel, and burnish each component by hand.',
        'Stitch & Finish – Saddle-stitching, edge sealing, conditioning, and a final inspection before your order leaves Travnik.',
      ],
      timelineTitle: 'Where We’re Heading',
      timelinePoints: [
        'Community workshops in Travnik for clients eager to learn hand-stitching and leather care.',
        'Collaborations with Bosnian creatives on limited capsule drops and experimental builds.',
        'A restoration programme so your Boa pieces can be revived for the next decade of wear.',
      ],
      contactTitle: 'Ready for Your Own Boa Story?',
      contactSubtitle:
        'Place your order via Instagram, Facebook, or email—we reply within 24 hours.',
      contactMethods: {
        instagram: {
          label: 'Instagram Direct',
          href: 'https://www.instagram.com/boa.belts.ba/',
          description: 'Send a DM with your idea, measurements, or inspiration photos.',
        },
        facebook: {
          label: 'Facebook Messenger',
          href: 'https://www.facebook.com/boa.belts.ba/',
          description: 'Chat with us in Bosnian or English to plan your order in real time.',
        },
        email: {
          label: 'Email',
          value: 'boabelts@gmail.com',
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
      title: 'Ru\u010dno ra\u0111eni kai\u0161evi',
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
    },
    beltsPage: {
      heroTitle: 'Ru\u010dno ra\u0111eni kai\u0161evi iz Travnika',
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
        materialSuffix: ' ko\u017ea',
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
      collectionTitle: 'Kolekcija ko\u017enih torbi',
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
        materialSuffix: ' ko\u017ea',
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
      closingTitle: 'Torba koja prati tvoj ritam',
      closingText:
        'Opi\u0161ite svoje dnevne navike ili planirani put, a mi \u0107emo predlo\u017eiti formu, boju i unutra\u0161nji raspored.',
      closingButton: 'Kreiraj torbu zajedno s nama',
    },
    walletsPage: {
      heroTitle: 'Nov\u010danici i dodaci uz koje trajete',
      heroSubtitle:
        'Kompaktni dizajni za kartice, gotovinu i uspomeneâ€”ru\u010dno \u0161iveni kako bi ostali tanki i izdr\u017eljivi.',
      heroCta: 'Zatra\u017ei skicu nov\u010danika',
      signatureTitle: 'Ru\u010dno ra\u0111eni modeli',
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
      heroParagraphs: [
        'Ru\u010dno krojeni i \u0161iveni dodaci koji ostaju tanki i pouzdani godinama.',
        'Birajte izme\u0111u ultra tankih futrola za kartice ili organizatora koji dr\u017ee dokumente, telefone i valute pod kontrolom.',
      ],
      collectionTitle: 'Kolekcija nov\u010danika i dodataka',
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
        materialSuffix: ' ko\u017ea',
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
      closingTitle: 'Prilagodimo va\u0161 svakodnevni pribor',
      closingText:
        'Napi\u0161ite koliko kartica nosite, u kojim valutama pla\u0107ate i da li imate posebne uspomeneâ€”predlo\u017eit \u0107emo raspored koji vam savr\u0161eno odgovara.',
      closingButton: 'Pokreni narud\u017ebu nov\u010danika',
    },
    aboutPage: {
      heroTitle: 'Boa Belts iznutra',
      heroSubtitle: 'Od garaže u Travniku do ormara širom svijeta—ručno rađeni komadi, čisto porijeklo i klijenti koji postaju prijatelji.',
      introTitle: 'Zašto radimo precizno',
      introParagraphs: [
        'Boa Belts je nastao uz jednu šivaću klupu, jednu kožu i ideju da svakodnevni predmeti zaslužuju pažnju kao porodična nasljeđa. Danas i dalje radimo u istoj ulici u Travniku, izrađujući kaiševe, torbe i novčanike po narudžbi.',
        'Svaka narudžba počinje razgovorom. Uparujemo evropsku, površno štavljenu kožu s tradicionalnim alatima i bilježimo svaki korak kako biste znali ko je izradio vaš komad i na koji način.',
      ],
      highlightsTitle: 'Šta nas vodi',
      highlights: [
        {
          title: 'Zanat, ne proizvodnja',
          description:
            'Radimo detaljno i precizno. Svaki rez, šav i poliranje nastaje u našem studiju kako bismo lično potpisali završnicu.',
        },
        {
          title: 'Transparentni materijali',
          description:
            'Sarađujemo samo s kožarama i livnicama koje dijele naše standarde održivosti, transparentnosti i poštovanja prema zanatu.',
        },
        {
          title: 'Komadi koji stare uz tebe',
          description:
            'Boa komadi su napravljeni da skupljaju priče, a ne da se troše. Patina i mogućnost restauracije važniji su nam od sezonskih trendova.',
        },
      ],
      processTitle: 'Kako nastaje tvoja narudžba',
      processSteps: [
        'Konsultacije i skice – Napiši nam kako ćeš nositi komad; zajedno crtamo siluetu i biramo okove.',
        'Selekcija i priprema – Rezervišemo odgovarajuću kožu, provjeravamo vlakna i ton, zatim ručno krojimo i profiliramo svaki dio.',
        'Šivenje i završna obrada – Saddle šav, obrada rubova, njegovanje i završna kontrola prije isporuke.',
      ],
      timelineTitle: 'Kuda idemo',
      timelinePoints: [
        'Radionice u Travniku za sve koji žele naučiti ručno šivenje i njegu kože.',
        'Saradnje s bh. kreativcima na limitiranim kapsulama i istraživačkim serijama.',
        'Program restauracije kako bi Boa komadi dobili novi sjaj i nakon godina nošenja.',
      ],
      contactTitle: 'Spreman/spremna za svoju Boa priču?',
      contactSubtitle:
        'Narudžbu možeš izvršiti porukom na Instagramu, Facebooku ili e-mailom — odgovaramo u roku od 24 sata.',
      contactMethods: {
        instagram: {
          label: 'Instagram poruka',
          href: 'https://www.instagram.com/boa.belts.ba/',
          description: 'Pošalji DM s idejom, mjerama ili fotografijama za inspiraciju.',
        },
        facebook: {
          label: 'Facebook Messenger',
          href: 'https://www.facebook.com/boa.belts.ba/',
          description: 'Piši nam na bosanskom ili engleskom i dogovori narudžbu u realnom vremenu.',
        },
        email: {
          label: 'Email',
          value: 'boabelts@gmail.com',
          description: 'Za detaljne brifove pošalji poruku s rokovima i referencama.',
        },
      },
      channelsTitle: 'Pridruži se našim kanalima',
      channelsSubtitle:
        'Prvi saznaj za nove modele, ograničene serije i pogled iza kulisa.',
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
      ctaTitle: 'Posjetite nas ili nam pišite',
      ctaText:
        'Termine rezervišemo za probe, izbor kože i konsultacije o dizajnu. Radujemo se novim idejama i pričama.',
      ctaButton: 'Zakaži posjetu studiju',
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


