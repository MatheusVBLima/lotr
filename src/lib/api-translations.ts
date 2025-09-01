// Translations for API data that needs localization
export const apiTranslations = {
  en: {
    // Gender values
    Male: 'Male',
    Female: 'Female',
    NaN: 'Unknown',
    
    // Common field labels
    race: 'Race',
    gender: 'Gender', 
    realm: 'Realm',
    height: 'Height',
    birth: 'Birth',
    death: 'Death',
    spouse: 'Spouse',
    hair: 'Hair',
    
    // Movie fields
    runtime: 'Runtime',
    budget: 'Budget',
    boxOffice: 'Box Office',
    awards: 'Academy Awards',
    rottenTomatoes: 'Rotten Tomatoes',
    
    // Common actions
    viewDetails: 'View Details',
    viewQuotes: 'View Quotes',
    viewChapters: 'View Chapters',
    
    // Quotes page
    searchQuotes: 'Search Quotes',
    searchQuotesDescription: 'Find memorable quotes from The Lord of the Rings trilogy',
    searchByText: 'Search quotes by text...',
    foundQuotes: 'Found',
    quotes: 'quotes',
    matchingSearch: 'matching your search',
    unknownCharacter: 'Unknown Character',
    unknownMovie: 'Unknown Movie',
    quote: 'Quote',
    previous: 'Previous',
    next: 'Next',
    
    // Details pages
    backTo: 'Back to',
    movies: 'Movies',
    characters: 'Characters',
    books: 'Books',
    runtime: 'Runtime',
    budget: 'Budget',
    revenue: 'Revenue',
    academyAwards: 'Academy Awards',
    rottenTomatoes: 'Rotten Tomatoes',
    winsNominations: 'Wins / Nominations',
    criticsScore: 'Critics Score',
    viewQuotesFromMovie: 'View Quotes from This Movie',
    viewQuotesFromCharacter: 'View Quotes from This Character',
    failedToLoad: 'Failed to load',
    detailsText: 'details. Please try again later.',
    
    // Character details
    viewQuotesBy: 'View Quotes by',
    wikiPage: 'Wiki Page',
    hairColor: 'Hair Color',
    
    // Filter labels
    filterByRace: 'Filter by race',
    filterByGender: 'Filter by gender',
    allRaces: 'All Races',
    allGenders: 'All Genders',
    
    // Races
    Hobbit: 'Hobbit',
    Human: 'Human',
    Elf: 'Elf',
    Dwarf: 'Dwarf',
    Wizard: 'Wizard',
    Orc: 'Orc',
    
    // Units
    minutes: 'minutes',
    millions: 'millions',
    
    // Movie titles (official Portuguese titles)
    'The Lord of the Rings Series': 'The Lord of the Rings Series',
    'The Fellowship of the Ring': 'The Fellowship of the Ring', 
    'The Two Towers': 'The Two Towers',
    'The Return of the King': 'The Return of the King',
    'The Hobbit Series': 'The Hobbit Series',
    'An Unexpected Journey': 'An Unexpected Journey',
    'The Desolation of Smaug': 'The Desolation of Smaug',
    'The Battle of the Five Armies': 'The Battle of the Five Armies'
  },
  pt: {
    // Gender values
    Male: 'Masculino',
    Female: 'Feminino', 
    NaN: 'Desconhecido',
    
    // Common field labels
    race: 'Raça',
    gender: 'Gênero',
    realm: 'Reino',
    height: 'Altura',
    birth: 'Nascimento',
    death: 'Morte',
    spouse: 'Cônjuge',
    hair: 'Cabelo',
    
    // Movie fields
    runtime: 'Duração',
    budget: 'Orçamento',
    boxOffice: 'Bilheteria',
    awards: 'Prêmios Oscar',
    rottenTomatoes: 'Rotten Tomatoes',
    
    // Common actions
    viewDetails: 'Ver Detalhes',
    viewQuotes: 'Ver Citações', 
    viewChapters: 'Ver Capítulos',
    
    // Quotes page
    searchQuotes: 'Pesquisar Citações',
    searchQuotesDescription: 'Encontre citações memoráveis da trilogia O Senhor dos Anéis',
    searchByText: 'Pesquisar citações por texto...',
    foundQuotes: 'Encontradas',
    quotes: 'citações',
    matchingSearch: 'correspondendo à sua pesquisa',
    unknownCharacter: 'Personagem Desconhecido',
    unknownMovie: 'Filme Desconhecido',
    quote: 'Citação',
    previous: 'Anterior',
    next: 'Próxima',
    
    // Details pages
    backTo: 'Voltar para',
    movies: 'Filmes',
    characters: 'Personagens',
    books: 'Livros',
    runtime: 'Duração',
    budget: 'Orçamento',
    revenue: 'Receita',
    academyAwards: 'Prêmios Oscar',
    rottenTomatoes: 'Rotten Tomatoes',
    winsNominations: 'Vitórias / Indicações',
    criticsScore: 'Nota dos Críticos',
    viewQuotesFromMovie: 'Ver Citações deste Filme',
    viewQuotesFromCharacter: 'Ver Citações deste Personagem',
    failedToLoad: 'Falha ao carregar',
    detailsText: 'detalhes. Tente novamente mais tarde.',
    
    // Character details
    viewQuotesBy: 'Ver Citações de',
    wikiPage: 'Página Wiki',
    hairColor: 'Cor do Cabelo',
    
    // Filter labels
    filterByRace: 'Filtrar por raça',
    filterByGender: 'Filtrar por gênero',
    allRaces: 'Todas as Raças',
    allGenders: 'Todos os Gêneros',
    
    // Races
    Hobbit: 'Hobbit',
    Human: 'Humano',
    Elf: 'Elfo',
    Dwarf: 'Anão',
    Wizard: 'Mago',
    Orc: 'Orc',
    
    // Units
    minutes: 'minutos',
    millions: 'milhões',
    
    // Movie titles (official Portuguese titles)
    'The Lord of the Rings Series': 'Série O Senhor dos Anéis',
    'The Fellowship of the Ring': 'A Sociedade do Anel',
    'The Two Towers': 'As Duas Torres', 
    'The Return of the King': 'O Retorno do Rei',
    'The Hobbit Series': 'Série O Hobbit',
    'An Unexpected Journey': 'Uma Jornada Inesperada',
    'The Desolation of Smaug': 'A Desolação de Smaug',
    'The Battle of the Five Armies': 'A Batalha dos Cinco Exércitos'
  }
} as const

// Helper function to translate API content
export function translateApiContent(key: string, locale: string = 'en'): string {
  const translations = apiTranslations[locale as keyof typeof apiTranslations] || apiTranslations.en
  return (translations as any)[key] || key
}

// Helper function to translate movie titles specifically
export function translateMovieTitle(title: string, locale: string = 'en'): string {
  return translateApiContent(title, locale)
}

// Helper function to translate character attributes
export function translateCharacterField(field: string, value: string, locale: string = 'en'): {
  field: string
  value: string
} {
  return {
    field: translateApiContent(field, locale),
    value: translateApiContent(value, locale)
  }
}