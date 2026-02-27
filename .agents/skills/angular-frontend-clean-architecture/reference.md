# Referência – Estrutura e fluxo

## Pastas e responsabilidades

| Pasta / arquivo | Quando usar |
|-----------------|-------------|
| **layout/** | Alterar shell da aplicação (header, menu, drawer, router-outlet). |
| **pages/<feature>/** | Nova área do app = nova pasta (ex.: orders). Inclui model, service, list e form. |
| **shared/components/** | Componente usado em mais de uma página ou UI genérica (page-header, loading). |
| **shared/directives/** | Comportamento reutilizável em elementos (autofocus, máscara de moeda). |
| **shared/pipes/** | Transformação reutilizável no template (truncate, currency). |
| **shared/services/** | Estado ou utilidade global (loading, layout, tema). |
| **shared/guards/** | Proteção de rotas (auth, roles). |
| **shared/interceptors/** | Interceptação de HTTP (erro global, token). |
| **app.routes.ts** | Novas rotas ou guards. |

## Fluxo de uma tela (ex.: listar produtos)

1. **Rotas:** `app.routes.ts` define `path: 'produtos'` → `ProductsListComponent`, com `canActivate: [authGuard]` se necessário.
2. **Componente:** `ProductsListComponent` usa `inject(ProductService)`, signals para `allProducts`, `loading`, `searchTerm`, `statusFilter`, e `computed` para `filteredProducts`.
3. **Service:** `ProductService` chama `this.http.get<Product[]>(this.baseUrl)` e expõe `Observable`.
4. **Template:** `@if (loading())` mostra spinner; `@else` com `@for (item of productTable.data; track item.id)` para a tabela; ações (editar, excluir) chamam métodos do componente que usam o service.

## Conteúdo por pasta

- **layout/main-layout:** template com header, drawer, `<router-outlet>`, injeção de `LayoutService` (tema, drawer visível).
- **pages/<feature>:** `*.model.ts`, `*.service.ts`, `<feature>-list/` (component + template + styles + spec), `<feature>-form/` quando houver CRUD com formulário.
- **shared/components:** um diretório por componente (page-header, loading, loading-overlay, splash-screen).
- **shared/directives:** um diretório por diretiva (autofocus, currency-mask); usar `host` para eventos e `input()` para opções.
- **shared/pipes:** um diretório por pipe (truncate).
- **shared/services:** serviços injetáveis globais (loading.service, layout.service).
- **shared/guards:** funções ou classes que implementam `CanActivateFn` / equivalente.
- **shared/interceptors:** `HttpInterceptor` para tratamento global de erro ou headers.

## Ambiente e API

- **environments/environment.ts:** `apiBaseUrl` apontando para o backend (dev/test/prod).
- Serviços de página montam a URL como `` `${environment.apiBaseUrl}/api/<recurso>` ``.

Manter essa estrutura permite escalar com novas features (nova pasta em pages/ + rotas + service) sem misturar lógica de domínio com shared.
