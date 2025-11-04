const fs = require("fs");

const path = "src/data/womensBelts.ts";
let file = fs.readFileSync(path, "utf8");

const replacements = new Map([
  ["w33", "Model idealan za bicikliste ili motoriste. Dizajniran tako da ostaje čvrsto vezan za tijelo, a dovoljno fleksibilan da u torbice stanu sve potrebne stvari za kraću ili dužu pustolovinu.\nModel je moguće izraditi u boji po želji."],
  ["w66", "Model koji definitivno privlači poglede. Ekstravagantan, drugačiji i poseban. Učvršćen sa tregerima, a ukrašen perjem, idealan je za neobične događaje. Model je moguće izraditi u boji po želji."],
  ["w03", "Model koji je sličan Zana belt-u, ali u elegantnijoj formi gdje umjesto perja oblik dobija naborima kože.\nModel je moguće izraditi u boji po želji."],
  ["w30", "Model koji prati poslovni outfit dame koja je uvijek spremna ostaviti trag. Dva kaišića na prednjem dijelu podešavaju veličinu u ovisnosti od odjeće, dok se na bokovima kaiš blago širi kako bi laskao svakoj figuri.\nModel je moguće izraditi u boji po želji."],
  ["w44", "Model idealan za dame koje vole efektnost i dominantnost. Kaiš koji ostavlja najveći dojam jer svojom dužinom dominira nad outfitom.\nModel je moguće izraditi u boji po želji."],
  ["w52", "Kao što mu i ime kaže, Domina belt je kaiš koji idealno naglašava struk, a pritom prikriva dijelove tijela koje ne želite isticati. Kaišić ispred daje dodatnu fleksibilnost i mogućnost prilagođavanja svakom outfitu.\nModel je moguće izraditi u boji po želji."],
  ["w53", "Model koji se prema srednjem dijelu blago spušta u špic i time se prilagođava tijelu. Veličina se podešava kaišićima sa bokova.\nModel je moguće izraditi u boji po želji."],
  ["w15", "Jedan od prvih modela nastalih u verziji sa tregerima koji se mogu i skidati. Inspirisan western stilom, donosi mnoštvo detalja iako vizuelno djeluje vrlo jednostavno.\nModel je moguće izraditi u boji po želji."],
  ["w16", "Jedan od najprodavanijih modela. Blagi luk na kukovima dodatno naglašava žensku figuru, dok vezanje na prednjem dijelu omogućava podešavanje veličine.\nModel je moguće izraditi u boji po želji."],
  ["w19", "Model koji izradom podsjeća na korzet. Kruti i čvrsti materijal ostavlja malo prostora za promjenu veličine, a kopča se jednom kopčom na stražnjoj strani.\nModel je moguće izraditi u boji po želji."],
  ["w24", "Model kojeg je moguće izraditi i bez tregera. Inspirisan western filmovima i neobičnim nošnjama.\nModel je moguće izraditi u boji po želji."],
  ["w28", "Model koji je apsolutni hit i može se nositi na dva načina: s ukrštenim kaiševima na prednjoj strani ili s dvjema kopčama naprijed i kaišićima nazad. Postoji i mogućnost da svaki kaišić bude u drugoj boji.\nModel je moguće izraditi u boji po želji."],
  ["w51", "Model koji je najprodavaniji kaiš u 2025. godini. U originalnoj verziji prati ga mala okrugla torbica koja se može skinuti i tako potpuno promijeniti izgled kaiša.\nModel je moguće izraditi u boji po želji."],
  ["w06", "Model prilagođen osobama koje vole imati sve sitnice uz sebe. Na osnovni kaiš nižu se torbica po torbica i detalj po detalj.\nModel je moguće izraditi u boji po želji."],
  ["w39", "Model koji se nosi direktno ispod grudi. Na malene krugove kače se tregeri koji se ne skidaju, dok se lanac s desne strane lako podešava.\nModel je moguće izraditi u boji po želji."],
  ["w49", "Dva unakrsno polukružna kaišića koja idealno ističu struk. Efektnost se krije u boji koju možete izabrati među svim nijansama iz našeg asortimana."],
  ["w27", "Samo za smjele, odvažne, unikatne i slobodne dame. Uz osnovni kaiš niz nogu se vežu dodaci koji se mogu i skinuti.\nModel je moguće izraditi u boji po želji."],
  ["w38", "Model koji se nosi direktno ispod grudi. Na malene krugove kače se tregeri koji se ne skidaju, dok se lanac s desne strane lako podešava.\nModel je moguće izraditi u boji po želji."],
  ["w40", "Model nastao prilagođavanjem Teja belta. Dva kaišića povezana su na stražnjoj strani jednim kaišem s tregerima koji se ne skidaju.\nModel je moguće izraditi u boji po želji."],
  ["w43", "Model nastao kao izvedenica Klea belta. Najpraktičniji kaiš u našoj ponudi jer od jedne baze dobijete tri verzije: obični kaiš, kaiš s tregerima i dva kaiša s tregerima.\nModel je moguće izraditi u boji po želji."],
  ["w04", "Model za sve koji ne vole nositi torbe, ali žele siguran prostor za novac, ključeve i telefon.\nModel je moguće izraditi u boji po želji."],
  ["w07", "Naš prvenac! Prvi kaiš ikada. Široki kaiš na vezanje idealan je za sve prigode.\nModel je moguće izraditi u boji po želji."]
]);

for (const [id, description] of replacements) {
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp('(\"id\"\\s*:\\s*\"' + escapedId + '\"[\\s\\S]*?\"description\"\\s*:\\s*\")([\\s\\S]*?)(\")');
  if (!pattern.test(file)) {
    console.warn('No match for ' + id);
    continue;
  }
  const escapedDescription = description.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  file = file.replace(pattern, '$1' + escapedDescription + '$3');
}

fs.writeFileSync(path, file, 'utf8');
