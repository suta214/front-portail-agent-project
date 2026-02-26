// ── Geo Data: Countries, Nationalities, Regions, Cities ──────────────────────
// Detailed cascade data for priority countries, text input fallback for others.

export const ALL_COUNTRIES: string[] = [
  'Afghanistan', 'Afrique du Sud', 'Albanie', 'Algérie', 'Allemagne', 'Andorre',
  'Angola', 'Antigua-et-Barbuda', 'Arabie Saoudite', 'Argentine', 'Arménie',
  'Australie', 'Autriche', 'Azerbaïdjan', 'Bahamas', 'Bahreïn', 'Bangladesh',
  'Barbade', 'Belgique', 'Belize', 'Bénin', 'Bhoutan', 'Biélorussie',
  'Birmanie (Myanmar)', 'Bolivie', 'Bosnie-Herzégovine', 'Botswana', 'Brésil',
  'Brunéi', 'Bulgarie', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodge',
  'Cameroun', 'Canada', 'Centrafrique', 'Chili', 'Chine', 'Chypre', 'Colombie',
  'Comores', 'Congo (Brazzaville)', 'Congo (RDC)', 'Corée du Nord', 'Corée du Sud',
  'Costa Rica', "Côte d'Ivoire", 'Croatie', 'Cuba', 'Danemark', 'Djibouti',
  'Dominique', 'Égypte', 'Émirats arabes unis', 'Équateur', 'Érythrée',
  'Espagne', 'Estonie', 'Eswatini', 'Éthiopie', 'Fidji', 'Finlande', 'France',
  'Gabon', 'Gambie', 'Géorgie', 'Ghana', 'Grèce', 'Grenade', 'Guatemala',
  'Guinée', 'Guinée-Bissau', 'Guinée équatoriale', 'Guyana', 'Haïti', 'Honduras',
  'Hongrie', 'Inde', 'Indonésie', 'Irak', 'Iran', 'Irlande', 'Islande',
  'Israël', 'Italie', 'Jamaïque', 'Japon', 'Jordanie', 'Kazakhstan', 'Kenya',
  'Kiribati', 'Koweït', 'Kirghizistan', 'Laos', 'Lesotho', 'Lettonie', 'Liban',
  'Liberia', 'Libye', 'Liechtenstein', 'Lituanie', 'Luxembourg',
  'Macédoine du Nord', 'Madagascar', 'Malaisie', 'Malawi', 'Maldives', 'Mali',
  'Malte', 'Maroc', 'Îles Marshall', 'Mauritanie', 'Maurice', 'Mexique',
  'Micronésie', 'Moldavie', 'Monaco', 'Mongolie', 'Monténégro', 'Mozambique',
  'Namibie', 'Nauru', 'Népal', 'Nicaragua', 'Niger', 'Nigeria', 'Norvège',
  'Nouvelle-Zélande', 'Oman', 'Ouganda', 'Ouzbékistan', 'Pakistan', 'Palaos',
  'Palestine', 'Panama', 'Papouasie-Nouvelle-Guinée', 'Paraguay', 'Pays-Bas',
  'Pérou', 'Philippines', 'Pologne', 'Portugal', 'Qatar', 'République dominicaine',
  'Roumanie', 'Russie', 'Rwanda', 'Saint-Kitts-et-Nevis', 'Sainte-Lucie',
  'Saint-Vincent-et-les-Grenadines', 'Samoa', 'Saint-Marin', 'Sao Tomé-et-Príncipe',
  'Sénégal', 'Serbie', 'Seychelles', 'Sierra Leone', 'Singapour', 'Slovaquie',
  'Slovénie', 'Îles Salomon', 'Somalie', 'Soudan', 'Soudan du Sud', 'Sri Lanka',
  'Suède', 'Suisse', 'Suriname', 'Syrie', 'Tadjikistan', 'Tanzanie', 'Tchad',
  'Thaïlande', 'Timor oriental', 'Togo', 'Tonga', 'Trinité-et-Tobago', 'Tunisie',
  'Turkménistan', 'Turquie', 'Tuvalu', 'Ukraine', 'Uruguay', 'Vanuatu',
  'Venezuela', 'Vietnam', 'Yémen', 'Zambie', 'Zimbabwe',
];

// ── Nationalities (French) ────────────────────────────────────────────────────
export const NATIONALITIES: string[] = [
  'Afghane', 'Sud-Africaine', 'Albanaise', 'Algérienne', 'Allemande', 'Andorrane',
  'Angolaise', 'Antiguaise', 'Saoudienne', 'Argentine', 'Arménienne', 'Australienne',
  'Autrichienne', 'Azerbaïdjanaise', 'Bahaméenne', 'Bahreïnienne', 'Bangladaise',
  'Barbadienne', 'Belge', 'Bélizienne', 'Béninoise', 'Bhoutanaise', 'Biélorusse',
  'Birmane', 'Bolivienne', 'Bosnienne', 'Botswanaise', 'Brésilienne', 'Brunéienne',
  'Bulgare', 'Burkinabée', 'Burundaise', 'Cap-Verdienne', 'Cambodgienne',
  'Camerounaise', 'Canadienne', 'Centrafricaine', 'Chilienne', 'Chinoise',
  'Chypriote', 'Colombienne', 'Comorienne', 'Congolaise', 'Nord-Coréenne',
  'Sud-Coréenne', 'Costaricaine', 'Ivoirienne', 'Croate', 'Cubaine', 'Danoise',
  'Djiboutienne', 'Dominiquaise', 'Dominicaine', 'Égyptienne', 'Émiratie',
  'Équatorienne', 'Érythréenne', 'Espagnole', 'Estonienne', 'Swazie',
  'Éthiopienne', 'Fidjienne', 'Finlandaise', 'Française', 'Gabonaise', 'Gambienne',
  'Géorgienne', 'Ghanéenne', 'Grecque', 'Grenadienne', 'Guatémaltèque',
  'Guinéenne', 'Bissau-Guinéenne', 'Équato-Guinéenne', 'Guyanienne', 'Haïtienne',
  'Hondurienne', 'Hongroise', 'Indienne', 'Indonésienne', 'Irakienne', 'Iranienne',
  'Irlandaise', 'Islandaise', 'Israélienne', 'Italienne', 'Jamaïcaine', 'Japonaise',
  'Jordanienne', 'Kazakhstanaise', 'Kényane', 'Kiribatienne', 'Koweïtienne',
  'Kirghize', 'Laotienne', 'Lésothane', 'Lettone', 'Libanaise', 'Libérienne',
  'Libyenne', 'Liechtensteinoise', 'Lituanienne', 'Luxembourgeoise',
  'Macédonienne', 'Malgache', 'Malaisienne', 'Malawienne', 'Maldivienne',
  'Malienne', 'Maltaise', 'Marocaine', 'Marshallaise', 'Mauritanienne',
  'Mauricienne', 'Mexicaine', 'Micronésienne', 'Moldave', 'Monégasque',
  'Mongole', 'Monténégrine', 'Mozambicaine', 'Namibienne', 'Nauruane', 'Népalaise',
  'Nicaraguayenne', 'Nigérienne', 'Nigériane', 'Norvégienne', 'Néo-Zélandaise',
  'Omanaise', 'Ougandaise', 'Ouzbèke', 'Pakistanaise', 'Palaosienne',
  'Palestinienne', 'Panaméenne', 'Papouasienne', 'Paraguayenne', 'Néerlandaise',
  'Péruvienne', 'Philippine', 'Polonaise', 'Portugaise', 'Qatarienne',
  'Dominicaine', 'Roumaine', 'Russe', 'Rwandaise', 'Kittitienne', 'Saint-Lucienne',
  'Vincentaise', 'Samoane', 'Saint-Marinaise', 'Santoméenne', 'Sénégalaise',
  'Serbe', 'Seychelloise', 'Sierra-Léonaise', 'Singapourienne', 'Slovaque',
  'Slovène', 'Salomonaise', 'Somalienne', 'Soudanaise', 'Sud-Soudanaise',
  'Sri-Lankaise', 'Suédoise', 'Suisse', 'Surinamaise', 'Syrienne', 'Tadjike',
  'Tanzanienne', 'Tchadienne', 'Thaïlandaise', 'Timoraise', 'Togolaise',
  'Tongane', 'Trinidadienne', 'Tunisienne', 'Turkmène', 'Turque', 'Tuvaluane',
  'Ukrainienne', 'Uruguayenne', 'Vanuatuane', 'Vénézuélienne', 'Vietnamienne',
  'Yéménite', 'Zambienne', 'Zimbabwéenne',
].sort();

// ── Cascade: Country → Regions → Cities ──────────────────────────────────────
// Only countries with full detailed data. Others fall back to free text input.
export const GEO_DATA: Record<string, Record<string, string[]>> = {

  // ── MAROC ──────────────────────────────────────────────────────────────────
  'Maroc': {
    'Casablanca-Settat': [
      'Casablanca', 'Mohammedia', 'El Jadida', 'Settat', 'Berrechid',
      'Benslimane', 'Khouribga', 'Azemmour', 'Bouskoura', 'Médiouna',
    ],
    'Rabat-Salé-Kénitra': [
      'Rabat', 'Salé', 'Kénitra', 'Témara', 'Khémisset', 'Tiflet',
      'Sidi Kacem', 'Sidi Slimane', 'Skhirat', 'Mnasra',
    ],
    'Fès-Meknès': [
      'Fès', 'Meknès', 'Taza', 'Ifrane', 'Errachidia', 'Midelt',
      'Boulemane', 'El Hajeb', 'Sefrou', 'Moulay Yacoub',
    ],
    'Tanger-Tétouan-Al Hoceïma': [
      'Tanger', 'Tétouan', 'Al Hoceïma', 'Fnideq', 'M\'Diq', 'Chefchaouen',
      'Larache', 'Ksar El Kébir', 'Asilah', 'Ouazzane',
    ],
    'Oriental': [
      'Oujda', 'Nador', 'Berkane', 'Taourirt', 'Guercif', 'Jerada',
      'Driouch', 'Figuig', 'Zaïo',
    ],
    'Béni Mellal-Khénifra': [
      'Béni Mellal', 'Khénifra', 'Azilal', 'Fqih Ben Salah', 'Khouribga',
      'Kasba Tadla', 'Souk Sebt', 'Boujad',
    ],
    'Marrakech-Safi': [
      'Marrakech', 'Safi', 'Essaouira', 'El Kelaa des Sraghna', 'Youssoufia',
      'Chichaoua', 'Ben Guerir', 'Tahanaout', 'Tamansourt',
    ],
    'Souss-Massa': [
      'Agadir', 'Tiznit', 'Taroudant', 'Inezgane', 'Ait Melloul',
      'Chtouka Ait Baha', 'Aourir', 'Biougra', 'Tafraout',
    ],
    'Drâa-Tafilalet': [
      'Ouarzazate', 'Errachidia', 'Zagora', 'Tinghir', 'Midelt',
      'Boumalne Dadès', 'Goulmima', 'Rissani',
    ],
    'Guelmim-Oued Noun': [
      'Guelmim', 'Tan-Tan', 'Sidi Ifni', 'Assa', 'Zag', 'Tata',
    ],
    'Laâyoune-Sakia El Hamra': [
      'Laâyoune', 'Boujdour', 'Tarfaya', 'Es-Semara',
    ],
    'Dakhla-Oued Ed-Dahab': [
      'Dakhla', 'Aousserd',
    ],
  },

  // ── TUNISIE ────────────────────────────────────────────────────────────────
  'Tunisie': {
    'Tunis': ['Tunis', 'La Marsa', 'Carthage', 'Le Bardo', 'La Goulette', 'Sidi Hassine'],
    'Ariana': ['Ariana', 'Raoued', 'La Soukra', 'Ettadhamen'],
    'Ben Arous': ['Ben Arous', 'Radès', 'Hammam Lif', 'Mégrine', 'Ezzahra'],
    'Manouba': ['Manouba', 'Oued Ellil', 'Douar Hicher', 'Denden'],
    'Nabeul': ['Nabeul', 'Hammamet', 'Kélibia', 'Menzel Temime', 'Korba'],
    'Zaghouan': ['Zaghouan', 'El Fahs', 'Bir Mcherga'],
    'Bizerte': ['Bizerte', 'Menzel Bourguiba', 'Mateur', 'Ghar El Melh'],
    'Béja': ['Béja', 'Medjez el-Bab', 'Testour', 'Nefza'],
    'Jendouba': ['Jendouba', 'Tabarka', 'Aïn Draham', 'Ghardimaou'],
    'Le Kef': ['Le Kef', 'Sakiet Sidi Youssef', 'Tajerouine'],
    'Siliana': ['Siliana', 'Makthar', 'Rouhia'],
    'Sousse': ['Sousse', 'Msaken', 'Hammam Sousse', 'Akouda', 'Kalaa Kebira'],
    'Monastir': ['Monastir', 'Moknine', 'Ksar Hellal', 'Jemmal', 'Skanes'],
    'Mahdia': ['Mahdia', 'El Djem', 'Ksour Essef', 'Chebba'],
    'Sfax': ['Sfax', 'Sakiet Eddaier', 'Thyna', 'El Ain'],
    'Kairouan': ['Kairouan', 'Hajeb El Ayoun', 'Nasrallah'],
    'Kasserine': ['Kasserine', 'Sbeitla', 'Fériana', 'Thala'],
    'Sidi Bouzid': ['Sidi Bouzid', 'Meknassy', 'Regueb'],
    'Gabès': ['Gabès', 'El Hamma', 'Mareth', 'Matmata'],
    'Médenine': ['Médenine', 'Djerba-Houmt Souk', 'Zarzis', 'Ben Gardane'],
    'Tataouine': ['Tataouine', 'Ghomrassen', 'Remada'],
    'Gafsa': ['Gafsa', 'Metlaoui', 'Moularès', 'Redeyef'],
    'Tozeur': ['Tozeur', 'Nefta', 'Degache'],
    'Kébili': ['Kébili', 'Douz', 'Souk Lahad'],
  },

  // ── ALGÉRIE ────────────────────────────────────────────────────────────────
  'Algérie': {
    'Alger': ['Alger', 'Bab Ezzouar', 'Bir Mourad Raïs', 'Bir Touta', 'Chéraga', 'Hydra', 'Kouba'],
    'Oran': ['Oran', 'Es-Sénia', 'Bir El Djir', 'Hassi Mefsoukh', 'Ain El Turk'],
    'Constantine': ['Constantine', 'El Khroub', 'Hamma Bouziane', 'Aïn Smara'],
    'Annaba': ['Annaba', 'El Bouni', 'El Hadjar', 'Berrahal'],
    'Sétif': ['Sétif', 'El Eulma', 'Aïn Oulmène', 'Bougaâ'],
    'Blida': ['Blida', 'Boufarik', 'Bougara', 'Larbaa'],
    'Batna': ['Batna', 'Barika', 'Merouana', 'Timgad'],
    'Tlemcen': ['Tlemcen', 'Maghnia', 'Ghazaouet', 'Remchi'],
    'Béjaïa': ['Béjaïa', 'Akbou', 'Kherrata', 'Tichy', 'Aokas'],
    'Skikda': ['Skikda', 'Azzaba', 'Collo', 'Tamalous'],
    'Tizi Ouzou': ['Tizi Ouzou', 'Azazga', 'Boghni', 'Draa Ben Khedda'],
    'Biskra': ['Biskra', 'Tolga', 'Sidi Okba', 'El Kantara'],
    'Jijel': ['Jijel', 'El Milia', 'Taher'],
    'Guelma': ['Guelma', 'Bouchegouf', 'Héliopolis'],
    'Médéa': ['Médéa', 'Ksar El Boukhari', 'Berrouaghia'],
    'Bouira': ['Bouira', 'Lakhdaria', 'M\'Chedallah'],
    'Mostaganem': ['Mostaganem', 'Sidi Ali', 'Achaacha'],
    'Tiaret': ['Tiaret', 'Frenda', 'Ksar Chellala'],
    'Mascara': ['Mascara', 'Mohammadia', 'Sig'],
    'Sidi Bel Abbès': ['Sidi Bel Abbès', 'Telagh', 'Ras El Ma'],
    'Chlef': ['Chlef', 'Ténès', 'Abou El Hassan'],
    'Souk Ahras': ['Souk Ahras', 'Sedrata', 'Taoura'],
    'Saïda': ['Saïda', 'Youb', 'Aïn El Hadjar'],
    'Bordj Bou Arréridj': ['Bordj Bou Arréridj', 'Ras El Oued', 'El Anseur'],
    'Boumerdès': ['Boumerdès', 'Rouïba', 'Khemis El Khechna'],
  },

  // ── FRANCE ────────────────────────────────────────────────────────────────
  'France': {
    'Île-de-France': ['Paris', 'Versailles', 'Boulogne-Billancourt', 'Saint-Denis', 'Argenteuil', 'Montreuil', 'Créteil', 'Nanterre', 'Vitry-sur-Seine'],
    'Auvergne-Rhône-Alpes': ['Lyon', 'Grenoble', 'Saint-Étienne', 'Clermont-Ferrand', 'Annecy', 'Chambéry', 'Villeurbanne', 'Bron'],
    'Nouvelle-Aquitaine': ['Bordeaux', 'Limoges', 'Poitiers', 'Pau', 'Bayonne', 'La Rochelle', 'Agen', 'Mérignac'],
    'Occitanie': ['Toulouse', 'Montpellier', 'Nîmes', 'Narbonne', 'Perpignan', 'Carcassonne', 'Albi', 'Castres'],
    'Hauts-de-France': ['Lille', 'Amiens', 'Roubaix', 'Tourcoing', 'Dunkerque', 'Valenciennes', 'Lens', 'Douai'],
    'Provence-Alpes-Côte d\'Azur': ['Marseille', 'Nice', 'Toulon', 'Aix-en-Provence', 'Avignon', 'Cannes', 'Antibes', 'Monaco'],
    'Grand Est': ['Strasbourg', 'Reims', 'Metz', 'Nancy', 'Mulhouse', 'Colmar', 'Troyes'],
    'Normandie': ['Rouen', 'Caen', 'Le Havre', 'Cherbourg', 'Évreux', 'Alençon'],
    'Pays de la Loire': ['Nantes', 'Angers', 'Le Mans', 'Saint-Nazaire', 'La Roche-sur-Yon'],
    'Bretagne': ['Rennes', 'Brest', 'Quimper', 'Lorient', 'Saint-Malo', 'Vannes'],
    'Bourgogne-Franche-Comté': ['Dijon', 'Besançon', 'Belfort', 'Auxerre', 'Chalon-sur-Saône'],
    'Centre-Val de Loire': ['Orléans', 'Tours', 'Bourges', 'Blois', 'Châteauroux'],
    'Corse': ['Ajaccio', 'Bastia', 'Porto-Vecchio', 'Corte'],
    'La Réunion': ['Saint-Denis', 'Saint-Paul', 'Saint-Pierre', 'Le Tampon'],
    'Martinique': ['Fort-de-France', 'Le Lamentin', 'Saint-Joseph'],
    'Guadeloupe': ['Pointe-à-Pitre', 'Les Abymes', 'Baie-Mahault'],
    'Guyane': ['Cayenne', 'Saint-Laurent-du-Maroni', 'Kourou'],
  },

  // ── ESPAGNE ────────────────────────────────────────────────────────────────
  'Espagne': {
    'Andalousie': ['Séville', 'Málaga', 'Cordoue', 'Grenade', 'Almería', 'Cadix', 'Huelva', 'Jaén'],
    'Catalogne': ['Barcelone', 'Gérone', 'Lérida', 'Tarragone', 'Hospitalet de Llobregat'],
    'Madrid': ['Madrid', 'Móstoles', 'Alcalá de Henares', 'Fuenlabrada', 'Leganés', 'Getafe'],
    'Communauté valencienne': ['Valence', 'Alicante', 'Castellón', 'Elche', 'Torrent'],
    'Galice': ['Saint-Jacques-de-Compostelle', 'La Corogne', 'Vigo', 'Ourense', 'Lugo'],
    'Pays basque': ['Bilbao', 'Saint-Sébastien', 'Vitoria-Gasteiz'],
    'Castille-et-León': ['Valladolid', 'Burgos', 'Salamanque', 'León', 'Ségovie'],
    'Castille-La Manche': ['Tolède', 'Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara'],
    'Murcie': ['Murcie', 'Carthagène', 'Lorca'],
    'Aragon': ['Saragosse', 'Huesca', 'Teruel'],
    'Estrémadure': ['Badajoz', 'Cáceres', 'Mérida'],
    'Îles Baléares': ['Palma', 'Manacor', 'Ibiza'],
    'Îles Canaries': ['Las Palmas', 'Santa Cruz de Tenerife', 'Telde', 'La Laguna'],
    'Navarre': ['Pampelune', 'Tudela'],
    'Cantabrie': ['Santander', 'Torrelavega'],
    'La Rioja': ['Logroño', 'Calahorra'],
    'Asturies': ['Oviedo', 'Gijón', 'Avilés'],
  },

  // ── SÉNÉGAL ────────────────────────────────────────────────────────────────
  'Sénégal': {
    'Dakar': ['Dakar', 'Pikine', 'Guédiawaye', 'Rufisque'],
    'Thiès': ['Thiès', 'Mbour', 'Tivaouane', 'Diourbel'],
    'Saint-Louis': ['Saint-Louis', 'Richard-Toll', 'Podor'],
    'Ziguinchor': ['Ziguinchor', 'Oussouye', 'Bignona'],
    'Kolda': ['Kolda', 'Vélingara'],
    'Louga': ['Louga', 'Linguère', 'Kébémer'],
    'Fatick': ['Fatick', 'Foundiougne', 'Gossas'],
    'Kaolack': ['Kaolack', 'Nioro du Rip', 'Guinguinéo'],
    'Tambacounda': ['Tambacounda', 'Bakel', 'Kédougou'],
    'Matam': ['Matam', 'Ranérou'],
  },

  // ── CÔTE D'IVOIRE ─────────────────────────────────────────────────────────
  "Côte d'Ivoire": {
    'Abidjan': ['Abidjan', 'Abobo', 'Yopougon', 'Cocody', 'Marcory', 'Treichville'],
    'Bouaké': ['Bouaké', 'Sakassou'],
    'Daloa': ['Daloa', 'Issia', 'Vavoua'],
    'Yamoussoukro': ['Yamoussoukro', 'Toumodi'],
    'Korhogo': ['Korhogo', 'Ferkessédougou'],
    'Man': ['Man', 'Danané', 'Biankouma'],
    'San-Pédro': ['San-Pédro', 'Tabou', 'Sassandra'],
    'Abengourou': ['Abengourou', 'Agnibilékrou'],
    'Gagnoa': ['Gagnoa', 'Oumé'],
    'Divo': ['Divo', 'Lakota'],
  },

  // ── MAURITANIE ────────────────────────────────────────────────────────────
  'Mauritanie': {
    'Nouakchott': ['Nouakchott', 'Tevragh-Zeina', 'Ksar', 'Toujounine'],
    'Nouadhibou': ['Nouadhibou', 'Boulanouar'],
    'Kiffa': ['Kiffa'],
    'Kaédi': ['Kaédi'],
    'Rosso': ['Rosso'],
    'Zouerate': ['Zouerate', 'Fderik'],
    'Atar': ['Atar', 'Chinguetti'],
    'Aleg': ['Aleg'],
    'Néma': ['Néma', 'Oualata'],
    'Aioun': ['Aioun', 'Timbedra'],
  },

  // ── MALI ──────────────────────────────────────────────────────────────────
  'Mali': {
    'Bamako': ['Bamako', 'Kalabancoura', 'Lafiabougou'],
    'Sikasso': ['Sikasso', 'Koutiala', 'Bougouni'],
    'Ségou': ['Ségou', 'Niono', 'Bla'],
    'Mopti': ['Mopti', 'Bandiagara', 'Djenné'],
    'Tombouctou': ['Tombouctou', 'Niafunké'],
    'Gao': ['Gao', 'Bourem'],
    'Kidal': ['Kidal'],
    'Kayes': ['Kayes', 'Kita'],
    'Koulikoro': ['Koulikoro', 'Kati', 'Kolokani'],
    'Taoudénit': ['Taoudénit'],
  },

  // ── MAROC (SAHARA OCCIDENTAL inclus dans MAROC) ───────────────────────────
  // ── ÉGYPTE ────────────────────────────────────────────────────────────────
  'Égypte': {
    'Le Caire': ['Le Caire', 'Gizeh', 'Héliopolis', 'Maadi', 'Nasr City'],
    'Alexandrie': ['Alexandrie', 'Sidi Gaber', 'Montazah'],
    'Assouan': ['Assouan', 'Louxor', 'Edfou'],
    'Port-Saïd': ['Port-Saïd'],
    'Suez': ['Suez', 'Ismaïlia'],
    'Assiout': ['Assiout', 'Sohag'],
    'Minia': ['Minia', 'Beni Suef'],
    'Tanta': ['Tanta', 'Mansourah', 'Zagazig'],
    'Hurghada': ['Hurghada', 'El Gouna'],
    'Charm el-Cheikh': ['Charm el-Cheikh', 'Dahab'],
  },

  // ── LIBAN ─────────────────────────────────────────────────────────────────
  'Liban': {
    'Beyrouth': ['Beyrouth', 'Hamra', 'Achrafieh', 'Mar Elias'],
    'Mont-Liban': ['Jounieh', 'Baabda', 'Aley', 'Beit Mery'],
    'Nord': ['Tripoli', 'Bcharré', 'Zgharta'],
    'Bekaa': ['Zahlé', 'Chtaura', 'Baalbek'],
    'Sud': ['Saïda', 'Tyr', 'Nabatieh'],
    'Nabatieh': ['Nabatieh', 'Bint Jbeil', 'Hasbaya'],
    'Akkar': ['Halba', 'Andqet'],
    'Baalbek-Hermel': ['Baalbek', 'Hermel'],
  },

  // ── TURQUIE ───────────────────────────────────────────────────────────────
  'Turquie': {
    'Istanbul': ['Istanbul', 'Kadıköy', 'Beşiktaş', 'Fatih', 'Üsküdar'],
    'Ankara': ['Ankara', 'Çankaya', 'Keçiören'],
    'Izmir': ['Izmir', 'Konak', 'Karşıyaka'],
    'Bursa': ['Bursa', 'Osmangazi', 'Nilüfer'],
    'Antalya': ['Antalya', 'Alanya', 'Side'],
    'Adana': ['Adana', 'Mersin'],
    'Gaziantep': ['Gaziantep', 'Şahinbey'],
    'Konya': ['Konya', 'Selçuklu'],
    'Kayseri': ['Kayseri', 'Melikgazi'],
    'Trabzon': ['Trabzon', 'Rize'],
  },
};

// ── Helper functions ──────────────────────────────────────────────────────────

/** Returns list of regions for a given country, or empty array if not in data */
export function getRegions(country: string): string[] {
  return Object.keys(GEO_DATA[country] || {});
}

/** Returns list of cities for a given country+region, or empty array */
export function getCities(country: string, region: string): string[] {
  return (GEO_DATA[country] || {})[region] || [];
}

/** Whether a country has detailed cascade data */
export function hasGeoData(country: string): boolean {
  return country in GEO_DATA;
}
