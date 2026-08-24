# Apache configuration

Not used by the live site. tommydeleon.com is served by Vercel, which handles
404 routing, compression, and cache headers itself.

This file is kept so the site can be moved to Apache shared hosting without
rebuilding that configuration from scratch. To use it, copy `.htaccess` into
the document root alongside the contents of `out/`.