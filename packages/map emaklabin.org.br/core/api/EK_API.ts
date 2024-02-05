namespace Core {
    export namespace API {
        export class EK_API {
            host = Core.CONFIG.host;
            wp = Core.CONFIG.wp;

            public getPages(params) {
                let url = this.getURLParams( 'pages', params );
                const Pages = UrlFetchApp.fetch(url);
                return JSON.parse( Pages.getContentText() );
            }

            public getPosts(params) {
                let url = this.getURLParams( 'posts', params );
                const Posts = UrlFetchApp.fetch(url);
                return JSON.parse( Posts.getContentText() );
            }

            public getCategories(params) {
                let url = this.getURLParams( 'categories', params );
                const Posts = UrlFetchApp.fetch(url);
                return JSON.parse( Posts.getContentText() );
            }

            public getTags(params) {
                let url = this.getURLParams( 'tags', params );
                const Posts = UrlFetchApp.fetch(url);
                return JSON.parse( Posts.getContentText() );
            }

            public getURL() {
                return `${this.host}/${this.wp}/`;
            }

            public getURLParams(namespace, params) {
                let url = this.getURL() + namespace;
                Object.entries(params).map((entry, i) => {
                    if (0 === i) {
                        url = `${url}?${entry[0]}=${entry[1]}`;
                    } else {
                        url = `${url}&${entry[0]}=${entry[1]}`;
                    }
                });
                return url;
            }
        }
    }
}
