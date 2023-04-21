export * from './controller' // essa classe vai primeiro na importacao pois ela é uma classe pai se não da erro de compilacao
export * from './facebook-login' // depois vem esse outro controlador que usa o de cima.. a partir daqui pode ser qualquer sequencia de import
