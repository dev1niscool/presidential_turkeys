"""Dependency-free static preview; accepts the managed preview CLI flags."""
import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

parser = argparse.ArgumentParser()
parser.add_argument('--host', default='127.0.0.1')
parser.add_argument('--port', type=int, default=3000)
parser.add_argument('--strictPort', action='store_true')
args = parser.parse_args()
ThreadingHTTPServer((args.host, args.port), SimpleHTTPRequestHandler).serve_forever()
