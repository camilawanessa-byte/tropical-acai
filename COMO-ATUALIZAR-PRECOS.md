# Como Atualizar Produtos e Precos

O cardapio do site fica no arquivo `cardapio.json`.

## Alterar preco

1. Abra o repositorio no GitHub.
2. Clique no arquivo `cardapio.json`.
3. Clique no icone de lapis para editar.
4. Procure o produto.
5. Altere somente o numero do campo `price`.
6. Clique em `Commit changes`.

Exemplo:

```json
"price": 24.9
```

Use ponto no lugar de virgula. Exemplo: `24.9`, nao `24,90`.

## Produto gratis ou incluso

Deixe o preco como `0`:

```json
"price": 0
```

## Alterar nome ou descricao

Edite os campos:

```json
"name": "Açaí 700ml",
"desc": "Tamanho familia"
```

## Adicionar um novo item

Copie um bloco inteiro de produto, cole logo abaixo e altere:

```json
{
  "id": "acai-700ml",
  "name": "Açaí 700ml",
  "price": 29.9,
  "desc": "Para dividir ou aproveitar mais"
}
```

O campo `id` deve ser unico, sem espacos e sem acentos.

Depois de salvar no GitHub, aguarde alguns minutos e atualize o site.
