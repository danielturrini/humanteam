# Campanhas — Human Team

Esta pasta e a area amigavel para projetos do `/team`.

Cada nova campanha deve nascer aqui:

```text
Campanhas/{nome-ou-data-da-campanha}/
  input/          materiais recebidos do usuario
  refs/kv/        referencias de KV com imagem + lettering
  refs/marca/     logo, brand kit, fontes e guias
  documentos/     PDFs de aprovacao e apresentacao
  final/          pecas finais publicaveis
  internal/       bastidor tecnico do time
```

Para o usuario:

- coloque briefing, textos e arquivos soltos em `input/`;
- coloque referencias de KV em `refs/kv/`;
- coloque logo e marca em `refs/marca/`;
- revise PDFs em `documentos/`;
- pegue entregas finais em `final/`.

O time pode manter logs, prompts e markdowns em `internal/`, mas essa pasta nao precisa ser lida pelo usuario.
