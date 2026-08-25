# Lançamento com Kiwify

## Produtos a criar

1. **IA na Prática — E-book**: pagamento único de **R$ 39,99**.
2. **IA na Prática — Plataforma**: produto separado, marcado como **assinatura recorrente mensal**. Defina o valor mensal antes de publicar.

Use a opção **Área de membros externa** no produto da plataforma. Assim, a Kiwify cuida do pagamento e esta plataforma cuida do acesso e das ferramentas.

## Conecte os botões do site

Após criar os dois produtos, copie os links em **Produtos → Ver links**. Abra `kiwify-config.js` e cole cada link entre as aspas correspondentes. Os botões “Comprar o e-book” e “Assine a plataforma” passarão a levar ao checkout correto.

## Liberação automática de acesso

No painel Kiwify, crie um webhook em **Apps → Webhooks** apontando para o endereço que será criado na próxima etapa técnica. Selecione pelo menos os eventos de compra aprovada, renovação aprovada, reembolso e cancelamento/inadimplência.

O servidor receberá o JSON da Kiwify e deverá:

- Criar o usuário quando o pagamento for aprovado;
- Marcar a assinatura como ativa em cada renovação aprovada;
- Bloquear o acesso quando houver reembolso, cancelamento ou fim das tentativas de cobrança;
- Guardar somente os dados necessários do cliente (nome, e-mail, status da assinatura e identificador da compra).

## Próxima construção

O painel atual é um MVP funcional no navegador. Para lançamento público, ele precisa de hospedagem, banco de dados, login por e-mail e o endpoint seguro do webhook. Não coloque links secretos, tokens ou senhas no site estático.

Referências: a Kiwify permite criar planos mensais de assinatura e entregar o produto por área de membros externa; também envia os eventos configurados via webhook em JSON. [Assinaturas da Kiwify](https://ajuda.kiwify.com.br/pt-br/article/como-criar-um-produto-de-assinatura-9crmrj/) e [webhooks](https://ajuda.kiwify.com.br/pt-br/article/como-funcionam-os-webhooks-2ydtgl/).
