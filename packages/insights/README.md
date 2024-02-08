# `@ek-apps/pkg-insights`

Script para gerar relatórios automáticos dos canais de comunicação da Casa Museu Ema Klabin.

Esse script faz o fetch de dados nas APIs do Google Analytics 4, GraphAPI (Facebook e Instagram), E-goi e WordPress.

## Como usar

1. Rode o comando `clasp open` na raiz do projeto `pkg-insights` para abrir o script no Google Apps Script.
2. Nas configurações do projeto, adicione as variáveis de ambiente necessárias:
   1. `id_analytics`: ID do Google Analytics 4, ver em `Admin > Propriedade > Informações da Propriedade`.
   2. `id_fbPage`: ID da página do Facebook, ver no Facebook Business Suite.
   3. `id_insta`: ID do Instagram, ver no Facebook Business Suite.
   4. `id_sheet`: ID da planilha onde os dados serão salvos, ver na URL da planilha.
   5. `id_youtube`: ID do canal do YouTube, ver no YouTube Studio.
   6. `token_egoi`: Token de acesso da API do E-goi, ver na documentação da API do E-goi.
   7. `token_youtube`: Token de acesso da API do YouTube, ver na documentação da API do YouTube.
   8. `token_graphAPI`: Token de acesso da API do Facebook, pegar no [GraphAPI Explorer](https://developers.facebook.com/tools/explorer/), com as permissões: `read_insights`, `catalog_management`, `pages_manage_cta`, `pages_manage_instant_articles`, `pages_show_list`, `read_page_mailboxes`, `business_management`, `pages_messaging`,  `pages_messaging_subscriptions`, `instagram_basic`, `instagram_manage_comments`, `instagram_manage_insights`, `instagram_content_publish`, `page_events`, `pages_read_engagement`, `pages_manage_metadata`, `pages_read_user_content`, `pages_manage_ads`, `pages_manage_posts`, `pages_manage_engagement`, `instagram_manage_events`.
   9. `token_wpdm`: Token de acesso da API do Wordpress Download Manager, ver em `Downloads > Configurações > REST API` no admin do WordPress.
3. Depois de preencher as variáveis execute a função `runReports` para gerar os relatórios, isto pode levar alguns minutos.
4. Verifique os dados na planilha configurada (a mesma do `id_sheet`).

## Referências

### Google Analytics 4

- Métricas - <https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema?hl=pt-br#metrics>
- Dimensões - <https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema?hl=pt-br#dimensions>

### E-goi

- Documentação: <https://developers.e-goi.com/api/v3/>

### WordPress Download Manager

- Documentação: <https://imsas.github.io/wpdm-rest-api-docs/#introduction>

### Facebook GraphAPI

- Documentação Facebook: <https://developers.facebook.com/docs/graph-api/reference/v19.0/insights>

- Documentação Instagram: <https://developers.facebook.com/docs/instagram-api/guides/insights/>

## A fazer

- Integrar com Youtube - os dados do Youtube estão sendo baixados manualmente pelo Youtube Studio;
- Integrar com Linkedin - a API do Linkedin requer autorização prévia da conta, e o prazo para aprovação é de 10 a 15 dias úteis;
- Integrar com Twitter;
- Integrar com o Google Search Console;
- Integrar com o Google My Business;
- Revisar lista de permissões da GraphAPI, estamos solicitando mais permissões do que o necessário para o funcionamento do script.
