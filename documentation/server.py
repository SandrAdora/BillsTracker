#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

ROOT = os.path.dirname(os.path.abspath(__file__))

class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = '/templates/index.html'
        return super().do_GET()

    def log_message(self, fmt, *args):
        print(f'  {args[0]} {args[1]}')

if __name__ == '__main__':
    os.chdir(ROOT)
    port = int(os.environ.get('PORT', 8000))
    server = HTTPServer(('0.0.0.0', port), Handler)
    print(f'eXpenseTrack running at http://0.0.0.0:{port}')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nServer stopped.')
